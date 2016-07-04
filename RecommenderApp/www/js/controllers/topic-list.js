angular.module('recommender.controllers')
.controller('topicListCtrl', function ($scope, $state, $localForage, utils, sync) {
    console.log('inside topic list');
    $scope.topics = [];
    var topicsStorage = utils.instance({name:'/topics'});
    function loadTopics() {
        var topics = [];
        topicsStorage.iterate((val, key) => {
            console.log('topic:', {key, val});
            topics.push(val);
        })
        .then(() => {
            $scope.topics = topics;
        });
    }
    $scope.syncTopics = (() => {
        sync.syncTopics().then(results => {
            $scope.$broadcast('scroll.refreshComplete');
            loadTopics(); 
        });
    });
    loadTopics();

    function deleteTopic(topic) {
        //TODO
    }
});
