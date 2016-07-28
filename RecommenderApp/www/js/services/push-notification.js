angular.module('recommender.services')
.factory('pushNotification', function ($q, $cordovaPushV5, config, req, $rootScope, sync, $state) {
    var options = config.pushNotificationOptions;

    function handleResponse(response) {
        var topicId = response.parentTopic;
        return sync.syncTopic(topicId)
            .then(() => {
                $state.go('tab.topic', {id: topicId});
            });
    }

    function handleResponseReq(responseReq) {
        return responseReq;
    }

    function handleOther(data) {
        return data;
    }

    function dataHandler(data) {
        return data.topic ? handleResponseReq
             : data.response ? handleResponse
             : handleOther;
    }

    function notificationHandler(event, data) {
        console.log('PUSH NOTIFICATION RECEIVED:', data);
        dataHandler(data);
    }

    function errorHandler(event, data) {
        console.log('PUSH ERROR RECEIVED:', data);
    }

    return {
        init() {
            return (window.cordova)
                ? $cordovaPushV5.initialize(options)
                    .then(initSuccess => {
                        console.log('cordova push init success:', initSuccess);
                        $cordovaPushV5.onNotification();
                        $cordovaPushV5.onError();
                        $rootScope.$on('$cordovaPushV5:notificationReceived',
                                       notificationHandler);
                        $rootScope.$on('$cordovaPushV5:errorOccurred',
                                       errorHandler);
                        return $cordovaPushV5.register();
                    })
                    .then(pushToken => {
                        console.log('pushToken:', pushToken);
                        return req.put('/user/update-push-token', {pushToken});
                    })
                    .catch(err => {
                        console.error('$cordovaPushV5 err:', err);
                    })
                : $q.resolve();
        }
    };
});
