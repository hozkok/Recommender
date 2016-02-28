recommender.factory('PushService', ['$ionicPush', '$rootScope', 'db', 'Login', 'userData',
function($ionicPush, $rootScope, db, Login, userData) {
    var pushToken, platform;

    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
        console.log('Ionic Push: Got token', data.token, data.platform);
        pushToken = data.token;
        platform = data.platform;
        Login.update({user_id: userData._id}, {pushToken: pushToken});
    });

    var handle_gcm_push = function(notification) {
        switch(notification.event) {
            case 'registered':
                console.log('register notification:', notification);
                break;
            case 'message':
                if(notification.payload['gcm.notification.message']) {
                    var msg_payload = notification.payload['gcm.notification.message'];
                    console.log('push message received:', msg_payload);
                    $rootScope.$broadcast('push:message', msg_payload);
                    db.save_message(msg_payload).then(
                        function() {
                            console.log('message is successfully saved into local db.');
                        },
                        function(err) {
                            console.log('ERR: message couldnt be saved into local db.',err)
                        }
                    );
                }
                else if(notification.payload['gcm.notification.topic']) {
                    var topic_payload = notification.payload['gcm.notification.topic'];
                    console.log('push topic received:', topic_payload);
                    $rootScope.$broadcast('push:topic', topic_payload);
                    db.save_topic(topic_payload).then(
                        function() {
                            console.log('Topic is successfully saved into the db.');
                        },
                        function(err) {
                            console.log('ERR: Topic couldnt be saved into db. ERR:', err);
                        }
                    );
                    console.log('saving topic participants by gcm');
                    db.save_participants(topic_payload.participants);
                }
                else if (notification.payload['gcm.notification.participant']) {
                    var participant_payload = notification.payload['gcm.notification.participant'];
                    console.log('push participant received:', participant_payload);
                    $rootScope.$broadcast('push:participant', participant_payload);
                    db.save_topic(participant_payload).then(
                        function (success) {
                            console.log('participant - topic saved.');
                        },
                        function (err) {
                            console.log('ERR: participant...', err);
                        }
                    );
                    db.new_participant(participant_payload).then(
                        function () {
                            console.log('New participant is successfully saved into db.');
                        },
                        function (err) {
                            console.log('ERR: new participant couldnt be saved into db:', err);
                        }
                    );
                }
                else {
                    console.log('ERR: unidentified message type');
                }
                break;
            case 'error':
                console.log('An error occured during notification event.');
                break;
            default:
                console.log('Unknown push notification event!');
                break;
        }
    };

    var registerOptions = {
        canShowAlert: true, 
        canSetBadge: true, 
        canPlaySound: true,
        canRunActionsOnWake: true, 
        // TODO: OnNotification should be a function somewhere else,
        //       we need to think about how to handle this
        onNotification: function(notification) {
            if(ionic.Platform.isAndroid()) {
                handle_gcm_push(notification);
            }
            else {
                console.log('Push platform is not supported yet.')
            }
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
