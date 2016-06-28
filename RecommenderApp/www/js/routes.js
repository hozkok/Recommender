angular.module('recommender.routes', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('topics', {
                url: '/topics',
                templateUrl: 'templates/topic-list.html',
                controller: 'topicListCtrl'
            });
    });
