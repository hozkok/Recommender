angular.module('recommender.controllers')
.controller('topicListCtrl', function ($scope, $state, $localForage, utils) {
    console.log('inside topic list');
    var topicsStorage = utils.instance({name:'user/topics'});
    $scope.topics = [];
    topicsStorage.iterate((val, key) => {
        console.log('topic:', {key, val});
        $scope.topics.push(val);
    });

    function deleteTopic(topic) {
        //TODO
    }
});
