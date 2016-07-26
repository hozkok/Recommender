angular.module('recommender.services')
.factory('pushNotification', function ($q, $cordovaPushV5, config, req) {
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
                    .then(pushToken => {
                        console.log('pushToken:', pushToken);
                        return req.put('/update-push-token', {pushToken});
                    })
                    .catch(err => {
                        console.error('$cordovaPushV5 err:', err);
                    })
                : $q.resolve();
        }
    };
});
