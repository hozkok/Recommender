recommender.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            //url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('topics', {
            templateUrl: 'templates/topics.html',
            controller: 'topicCtrl',
            params: {phone: null}
        });
    //$urlRouterProvider.otherwise('/login');
}]);
