angular.module('recommender.controllers')
.controller('responseListCtrl', function (
        $scope,
        req,
        utils,
        info,
        dataService,
        $q,
        selectParticipants,
        $ionicPopup) {
    console.log('inside responsesCtrl');
    var responseStorage = utils.instance({name: '/responses'});
    $scope.responses = [];
    responseStorage.iterate((val, key) => {
        $scope.responses.push(val);
    });

    function expiryFn(compareDate) {
        compareDate = compareDate || new Date();
        return response => {
            if (!response.parentTopic.destructDate) {
                return true;
            }
            var destructDate = new Date(response.parentTopic.destructDate);
            console.log({compareDate, destructDate});
            return compareDate < destructDate;
        };
    }

    utils.loadItems(responseStorage, {filter: expiryFn()})
        .then(responses => {
            $scope.responses = responses;
        });

    $scope.refresh = () => {
        req.get('/responses')
            .then(httpRes => {
                console.log(httpRes);
                return $q.all(httpRes.data.map(responseObj =>
                    responseStorage.setItem(responseObj._id,
                        responseObj)));
            })
            .then(results => {
                console.log(results);
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

    $scope.$on('responsedata', (event, newResponseData) => {
        var matchResponse = $scope.responses.find(response =>
            response._id === newResponseData._id
        );
        if (matchResponse) {
            Object.assign(matchResponse, newResponseData);
        }
    });

    function putResponse(response) {
        return req.put(('/responses/' + response._id), response)
            .then(httpRes => {
                var updatedResponse = httpRes.data;
                response.isFulfilled = true;
                return responseStorage.setItem(response._id, response);
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
        $ionicPopup.prompt({
            title: 'Respond with a message.'
        }).then(val => {
            if (!val) {
                return;
            }
            response.text = val;
            info.loading(putResponse(response), {
                successMessage: 'response sent!',
                errorMessage: undefined
            });
        });
    };

    $scope.deleteResponse = (response) => {
        $ionicPopup.confirm({
            title: 'Are you sure to delete this request?',
        }).then(confirmed => {
            if (!confirmed) {
                return;
            }
            return info.loading(
                req.delete('/responses/' + response._id)
                    .catch(err => {
                        if (err.status === 404) {
                            return err;
                        }
                        $q.reject(err);
                    })
                    .then(httpRes => {
                        return responseStorage.removeItem(response._id);
                    })
                    .then(result => {
                        utils.removeOne($scope.responses,
                                        (r => r._id === response._id));
                    }),
                {
                    successMessage: 'Response request is deleted.',
                    errorMessage: undefined,
                }
            );
        });
    };

    $scope.forwardResponse = (response) => {
        selectParticipants($scope.$new(), {
            excludes: response.parentTopic.responses.map(r => r.participant),

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
                        return $q.reject(err.status === 404
                            ? 'Topic is not found.'
                            : err);
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
