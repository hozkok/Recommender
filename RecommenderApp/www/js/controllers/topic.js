angular.module('recommender.controllers')
.controller('topicCtrl', function ($scope, $stateParams, utils, selectParticipants, req, dataService, info, $q, sync) {
    var topicId = $stateParams.id;
    var topicStore = utils.instance({name: '/topics'});
    topicStore.getItem(topicId)
        .then(topic => {
            console.log(topic);
            $scope.topic = topic;
            $scope.topic.participants = [];
        });

    $scope.addParticipants = () => {
        selectParticipants($scope.$new(), {
            excludes: $scope.topic.responses
                .map(response => response.participant._id),

            onTap: (event, selectedParticipants) => {
                    var participants = $scope.topic.participants;
                    if (selectedParticipants.length === 0) {
                        return;
                    }
                    var responses = selectedParticipants.map(p => {
                        return {
                            parentTopic: $scope.topic,
                            participant: p,
                            addedBy: dataService.get('user'),
                            shareDegree: 0
                        };
                    });
                    var promise = $q.all(responses.map(newResponse =>
                        req.post('/responses', newResponse)
                    )).then(results => {
                        console.log(results);
                        return req.get('/topics/' + $scope.topic._id)
                            .then(httpRes => {
                                $scope.topic = httpRes.data;
                                return topicStore.setItem($scope.topic._id,
                                                          httpRes.data);
                            });
                    });
                    info.loading(promise, {
                        successMessage: 'participants added.',
                        errorMessage: undefined,
                    });
                }
        });
    };

    $scope.syncTopic = () => {
        sync.syncTopic($scope.topic._id)
            .then(result => {
                $scope.topic = result;
                $scope.$broadcast('scroll.refreshComplete');
            });
    };
});
