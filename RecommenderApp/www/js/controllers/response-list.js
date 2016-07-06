angular.module('recommender.controllers')
.controller('responseListCtrl', function (
        $scope,
        req,
        utils,
        info,
        dataService,
        $q,
        selectParticipants) {
    console.log('inside responsesCtrl');
    var responseStorage = utils.instance({name: '/responses'});
    $scope.responses = [];
    responseStorage.iterate((val, key) => {
        $scope.responses.push(val);
    });

    $scope.refresh = () => {
        req.get('/responses')
            .then(httpRes =>
                $q.all(httpRes.data.map(responseObj =>
                    responseStorage.setItem(responseObj._id,
                                            responseObj))))
            .then(results => {
                $scope.responses = $scope.responses.concat(results);
                $scope.$broadcast('scroll.refreshComplete');
            })
            .catch(err => {
                switch (err.status) {
                case 404:
                    console.log('no new response found.');
                    break;
                default:
                    console.log('something is wrong...');
                    console.error('refresh err:', err);
                }
            })
            .then(() => {
                $scope.$broadcast('scroll.refreshComplete');
            });
    };

    function putResponse(response) {
        return req.put(('/responses/' + response._id), response)
            .then(httpRes => {
                var updatedResponse = httpRes.data;
                response.isFulfilled = true;
                return responseStorage.setItem(response._id,
                                               response);
            });
    }

    function addResponse(contact, response) {
        return req.post('/responses', {
            participant: contact,
            parentTopic: response.parentTopic,
            shareDegree: response.shareDegree,
        });
    }

    $scope.updateResponseText = (response) => {
        info.loading(putResponse(response), {
            successMessage: 'response sent!',
            errorMessage: undefined
        });
    };

    $scope.forwardResponse = (response) => {
        console.log($scope.responses);
        selectParticipants($scope.$new(), {
            excludes: $scope.responses.reduce((acc, response) => {
                return acc.concat(response.parentTopic.responses
                    .map(r => r.participant));
            }, []),
            onTap: (event, selectedParticipants) => {
                if (selectedParticipants.length === 0) {
                    return;
                }
                var newResponses = selectedParticipants.map(p => {
                    return {
                        participant: p,
                        parentTopic: response.parentTopic,
                        shareDegree: response.shareDegree,
                    };
                });
                var promise = $q.all(newResponses.map(r =>
                    req.post('/responses', r)
                )).then(results => {
                    results.forEach(result => {
                        console.log('result:', result);
                        response.parentTopic.responses.push(result.data);
                    });
                    return responseStorage.setItem(response._id, response);
                })
                .catch(err => {
                    console.error(err);
                    return $q.reject(err);
                });
                info.loading(promise, {
                    successMessage: 'topic is successfully forwarded.',
                    errorMessage: undefined,
                });
            }
        });
    };

    $scope.idToDate = utils.objIdToDate;
});
