angular.module('recommender.controllers')
.controller('topicCtrl', function ($scope, $stateParams, utils, selectParticipants, req, dataService, info, $q, sync, $ionicPopup, $ionicHistory) {
    var topicId = $stateParams.id;
    var topicStore = utils.instance({name: '/topics'});
    topicStore.getItem(topicId)
        .then(topic => {
            console.log(topic);
            $scope.topic = topic;
            $scope.topic.participants = [];
        });

    $scope.$on('topicdata', (event, newTopicData) => {
        if (newTopicData._id === topicId) {
            $scope.topic = topic;
        }
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

    $scope.deleteTopic = () => {
        $ionicPopup.confirm({
            title: 'Are you sure to delete topic?'
        }).then(confirmed => {
            if (!confirmed) {
                return;
            }
            return info.loading(
                req.delete('/topics/' + topicId)
                    .then(httpRes => {
                        return topicStore.removeItem(topicId);
                    })
                    .then(result => {
                        $ionicHistory.goBack();
                    }),
                {
                    successMessage: 'Topic has been deleted.',
                    errorMessage: undefined,
                }
            );
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
