angular.module('recommender.services')
.factory('pushNotification', function ($q, $cordovaPushV5, config) {
    var options = config.pushNotificationOptions;
    return {
        init() {
            return (window.cordova)
                ? $cordovaPushV5.initialize(options)
                    .then(initSuccess => {
                        console.log('cordova push init success:', initSuccess);
                        $cordovaPushV5.onNotification();
                        $cordovaPushV5.onError();
                        return $cordovaPushV5.register();
                    })
                    .then(registerData => {
                        console.log({registerData});
                    })
                : $q.resolve();
        }
    };
});
