angular.module('recommender.config', [])
.constant('config', {
    baseUrl: (!window.cordova) ? '/localhost' : 'http://localhost:3000',
    infoDuration: 1500,
});
