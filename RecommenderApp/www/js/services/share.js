angular.module('recommender.services')
.factory('share', function ($cordovaSocialSharing, $ionicPopup) {
    return function (opts) {
        if (!window.cordova) {
            return $ionicPopup.alert({
                title: 'Not available on browser.'
            });
        }
        return $cordovaSocialSharing.share(
            opts.message,
            opts.subject,
            opts.file,
            opts.link
        );
    };
});
