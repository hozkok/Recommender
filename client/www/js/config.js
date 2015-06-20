recommender.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            url: 'login',
            templateUrl: 'templates/login.html'
        });
    $urlRouterProvider.otherwise('login');
}]);
