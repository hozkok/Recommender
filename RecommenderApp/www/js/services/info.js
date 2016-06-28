angular.module('recommender.services')
.factory('info', function ($cordovaToast, config, $ionicLoading, $timeout, $q) {
    return {
        show: (msg) => $cordovaToast.show(msg, 'short', 'bottom'),
        loading_: (promise, successMsg, errMsg, infoDuration) => {
            infoDuration = (infoDuration !== undefined)
                ? infoDuration
                : config.infoDuration;
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
            return $q((resolve, reject) => {
                promise
                    .then(result => {
                        $ionicLoading.show({
                            template: successMsg || result
                        });
                        $timeout(() => {
                            $ionicLoading.hide();
                            resolve(result);
                        }, infoDuration);
                    })
                    .catch(err => {
                        $ionicLoading.show({
                            template: errMsg || err
                        });
                        $timeout(() => {
                            $ionicLoading.hide();
                            reject(err);
                        }, infoDuration);
                    });
            });
        },
        loading: (promise, opts) => {
            opts = opts || {};
            var infoDuration = (opts.infoDuration !== undefined)
                ? infoDuration
                : config.infoDuration;
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
            return $q((resolve, reject) => {
                promise
                    .then(result => {
                        $ionicLoading.show({
                            template: (opts.successMessage !== undefined)
                                ? opts.successMessage
                                : result
                        });
                        $timeout(() => {
                            $ionicLoading.hide();
                            resolve(result);
                        }, infoDuration);
                    })
                    .catch(err => {
                        $ionicLoading.show({
                            template: opts.errorMessage !== undefined
                                ? opts.errorMessage
                                : err
                        });
                        $timeout(() => {
                            $ionicLoading.hide();
                            reject(err);
                        }, infoDuration);
                    });
            });
        },
    };
});
