// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('recommender', [
    'ionic',
    'ngCordova',
    'recommender.services',
    'recommender.controllers',
    'recommender.routes',
    'recommender.config',
    'LocalForageModule',
])

.run(function ($ionicPlatform, $state, mainService, data) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        mainService.init()
            .then((results) => {
                console.log(`results: ${results}`);
                $state.go(data.user
                    ? 'topics'
                    : 'login');
            });
    });
})

.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.navBar.alignTitle('left');
    $ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $ionicConfigProvider.backButton.icon('ion-ios-arrow-left');
})

.config(function ($localForageProvider) {
    $localForageProvider.config({
        version: 1.0,
        description: 'recommender offline storage'
    });
});

//.config(function ($stateProvider) {
//    $stateProvider
//        .state('login', {
//            url: '/login',
//            templateUrl: 'templates/login.html',
//            controller: 'loginCtrl'
//        });
//});
