recommender.controller('topicCtrl', ['$scope', '$state', '$stateParams', 'db',
function($scope, $state, $stateParams, db) {
    console.log('topicCtrl is initialized successfully.');
    console.log('topicCtrl phone param:', $stateParams.phone);
    $scope.phone = $stateParams.phone;
}]);
