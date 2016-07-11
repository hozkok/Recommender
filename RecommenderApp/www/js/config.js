angular.module('recommender.config', [])
.constant('config', {
    //baseUrl: (!window.cordova) ? '/localhost' : 'http://localhost:3000',
    baseUrl: 'http://46.101.24.174:8080',
    infoDuration: 1500,
});
