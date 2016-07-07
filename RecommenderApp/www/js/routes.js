angular.module('recommender.routes', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'loginCtrl'
            })
            .state('tab', {
                url: '/tab',
                templateUrl: 'templates/tab-container.html',
                controller: function ($scope, share) {
                    $scope.share = share.bind(undefined, {
                        message: 'Recommender is a great app. want to try out?',
                        subject: 'Recommender App',
                        link: 'web.recommender.com',
                    });
                },
                abstract: true,
            })
            .state('tab.topics', {
                url: '/topics',
                templateUrl: 'templates/topic-list.html',
                controller: 'topicListCtrl'
            })
            .state('tab.topic', {
                url: '/topics/:id',
                templateUrl: 'templates/topic.html',
                controller: 'topicCtrl'
            })
            .state('tab.responses', {
                url: '/responses',
                templateUrl: 'templates/response-list.html',
                controller: 'responseListCtrl'
            })
            .state('tab.newTopic', {
                url: '/new-topic',
                templateUrl: 'templates/new-topic.html',
                controller: 'newTopicCtrl'
            });
    });
