angular.module('recommender.services')
.factory('share', function ($cordovaSocialSharing, $ionicPopup) {
    return function (shareObj) {
        if (!window.cordova) {
            return $ionicPopup.alert({
                template: 'Not available on browser.'
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
