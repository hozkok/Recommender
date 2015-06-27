recommender.controller('topicListCtrl', ['$scope', '$state', '$stateParams', '$resource', 'db', 'Topics',
function($scope, $state, $stateParams, $resource, db, Topics) {
    console.log('topicListCtrl is initialized successfully.');
    console.log('topicListCtrl uid param:', $stateParams.uid);
    Topics.query({user_id: $stateParams.uid}, function(topics) {
        console.log(topics);
        $scope.topics = topics;
    });
    //$scope.phone = $stateParams.phone;
}]);


recommender.controller('topicCtrl', ['$scope', '$state', '$stateParams', '$resource', 'db', 'Topic',
function($scope, $state, $stateParams, $resource, db, Topic) {
    console.log('topicCtrl is initialized successfully.');
    console.log('topic id:', $stateParams.topic_id);
    Topic.get({topic_id: $stateParams.topic_id}, function(topic) {
        console.log('topic ->', topic);
        $scope.topic = topic;
    });
}]);
