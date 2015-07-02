recommender.factory('Messaging', ['$ionicPush', '$rootScope', 'db', 'Login', 'userData',
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
            $rootScope.$broadcast('notification', notification);
            return true;
        }
    };

    console.log('Messaging is initialized successfully.');

    return {
        register: function() {
            return $ionicPush.register(registerOptions);
        }
    };
}]);
