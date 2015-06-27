recommender.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('login', {
            //url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('topicList', {
            templateUrl: 'templates/topicList.html',
            controller: 'topicListCtrl',
            params: {phone: null, uid: null}
        })
        .state('topic', {
            templateUrl: 'templates/topic.html',
            controller: 'topicCtrl',
            params: {topic_id: null}
        });
    //$urlRouterProvider.otherwise('/login');
}]);
