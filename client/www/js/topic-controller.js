recommender.controller('topicCtrl', ['$scope', '$state', '$stateParams', '$resource', 'db', 'Topics',
function($scope, $state, $stateParams, $resource, db, Topics) {
    console.log('topicCtrl is initialized successfully.');
    console.log('topicCtrl uid param:', $stateParams.uid);
    Topics.query({user_id: $stateParams.uid}, function(topics) {
        console.log(topics);
        $scope.topics = topics;
    });
    //$scope.phone = $stateParams.phone;
}]);
