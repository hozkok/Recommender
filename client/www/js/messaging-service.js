recommender.factory('PushService', ['$ionicPush', '$rootScope', 'db', 'Login', 'userData',
function($ionicPush, $rootScope, db, Login, userData) {
    var pushToken, platform;

    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
        console.log('Ionic Push: Got token', data.token, data.platform);
        pushToken = data.token;
        platform = data.platform;
        Login.update({user_id: userData._id}, {pushToken: pushToken});
    });

    var registerOptions = {
        canShowAlert: true, 
        canSetBadge: true, 
        canPlaySound: true,
        canRunActionsOnWake: true, 
        // TODO: OnNotification should be a function somewhere else,
        //       we need to think about how to handle this
        onNotification: function(notification) {
            console.log('notification:', notification);
            console.log('payload:', notification.payload);
            // TODO: change receivedObj to android when using real tokens
            //var receivedObj = notification.alert;
            //var notification_type = 'notification:' + ((receivedObj.text) ? 'message' : 'topic');
            //$rootScope.$broadcast(notification_type, receivedObj);

            //if(notification_type === 'notification:topic') {
            //    db.save_topic(receivedObj).then(function() {
            //        console.log('Topic is successfully saved into the db.');
            //    }, function(err) {
            //        console.log('Topic couldnt be saved into db. ERR:', err);
            //    });
            //}
            //else if(notification_type === 'notification:message') {
            //    console.log('new message push notification!', receivedObj);
            //    db.save_message(receivedObj).then(function() {
            //        console.log('Message is successfully saved into db.');
            //    }, function(err) {
            //        console.log('Message couldnt be saved into db. ERR:', err);
            //    });
            //}
            //else {
            //    console.log('something is horribly wrong!');
            //}

            return true;
        }
    };

    console.log('PushService is initialized successfully.');

    return {
        register: function() {
            return $ionicPush.register(registerOptions);
        }
    };
}]);
