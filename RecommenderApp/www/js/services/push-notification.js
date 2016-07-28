angular.module('recommender.services')
.factory('pushNotification', function ($q, $cordovaPushV5, config, req, $rootScope, sync, $state, $ionicHistory) {
    var options = config.pushNotificationOptions;

    function handleResponse(response) {
        var topicId = response.parentTopic._id
            ? response.parentTopic._id
            : response.parentTopic;
        return sync.syncTopic(topicId)
            .then(() => {
                $state.go('tab.topic', {id: topicId});
            });
    }

    function handleResponseReq() {
        return sync.syncResponses()
            .then(() => {
                $ionicHistory.nextViewOptions({
                    historyRoot: true
                });
                $state.go('tab.responses');
            });
    }

    function handleOther(data) {
        return data;
    }

    function dataHandler(data) {
        switch (data.additionalData.payload.type) {
        case 'response-request':
            handleResponseReq(data);
            break;
        case 'topic-response':
            handleResponse(data.additionalData.response);
            break;
        default:
            console.error('undefined push notification type.');
        }
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
