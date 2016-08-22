angular.module('recommender.controllers')
.controller('topicListCtrl', function (
        $scope,
        $q,
        $state,
        $localForage,
        utils,
        sync) {
    console.log('inside topic list');
    $scope.topics = [];
    var topicsStorage = utils.instance({name:'/topics'});

    function expiryFn(compareDate) {
        compareDate = compareDate || new Date();
        return topic => {
            if (!topic.destructDate) {
                return true;
            }
            var destructDate = new Date(topic.destructDate);
            console.log('compareDate:', compareDate, 'destructDate', topic.destructDate, ':::', compareDate < destructDate);
            return compareDate < destructDate;
        };
    }

    function loadTopics() {
        utils.loadItems(topicsStorage, {filter: expiryFn()})
            .then(topics => {
                $scope.topics = topics;
            });
    }

    $scope.syncTopics = (() => {
        // sync.syncTopics().then(results => {
        //     $scope.$broadcast('scroll.refreshComplete');
        //     loadTopics(); 
        // });

        $q.all($scope.topics.map(topic =>
            sync.syncTopic(topic)
                .then(syncedTopic => {
                    Object.assign(topic, syncedTopic);
                    return syncedTopic;
                })
        )).then(results => {
            console.log('syncTopics results:', results);
            $scope.$broadcast('scroll.refreshComplete');
        });
    });

    loadTopics();

    function deleteTopic(topic) {
        //TODO
    }
});
