recommender.config(function($stateProvider, $urlRouterProvider, $ionicAppProvider) {
    $stateProvider
        .state('login', {
            //url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'loginCtrl'
        })
        .state('topics', {
            templateUrl: 'templates/topics.html',
            controller: 'topicCtrl',
            params: {phone: null, uid: null}
        });

    $ionicAppProvider.identify({
        // The App ID (from apps.ionic.io) for the server
        app_id: 'ef898301',
        // The public API key all services will use for this app
        api_key: 'b928f9384ca95a5e6191540a5e4e0b2482ca3faa1d4f9680',
        // Set the app to use development pushes
        dev_push: true
    });
});
