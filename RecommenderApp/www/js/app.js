// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('recommender', [
    'ionic',
    'ngCordova',
    'ion-autocomplete',
    'ionic-datepicker',
    'LocalForageModule',
    'recommender.services',
    'recommender.controllers',
    'recommender.routes',
    'recommender.config',
])

.run(function ($ionicPlatform, $state, mainService, dataService, sync, info) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
        mainService.init()
            .then(results => {
                console.log(`mainService init results:`, results);
                if (dataService.get('user')) {
                    sync.all();
                    $state.go('tab.topics');
                } else {
                    $state.go('login');
                }
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
        name: 'recommender',
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
