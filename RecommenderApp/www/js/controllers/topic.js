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

            onTap: event => {
                    var participants = $scope.topic.participants;
                    if (!participants.length) {
                        return;
                    }
                    var responses = participants.map(p => {
                        return {
                            parentTopic: $scope.topic,
                            participant: p,
                            addedBy: dataService.get('user'),
                            shareDegree: 0
                        };
                    });
                    $q.all(responses.map(newResponse =>
                        req.post('/responses', newResponse)
                    ))
                    .then(results => {
                        info.show('participants added');
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
