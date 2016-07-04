angular.module('recommender.controllers')
.controller('topicCtrl', function ($scope, $stateParams, utils) {
    var topicId = $stateParams.id;
    var topicStore = utils.instance({name: '/topics'});
    topicStore.getItem(topicId)
        .then(topic => {
            console.log(topic);
            $scope.topic = topic;
        });
});
