var http = require('http');
var gcm = require('node-gcm');
var gcmSender = new gcm.Sender('AIzaSyAqDHk0h7U27ZBRWcX_leW5aFvh2UTT5MQ');

var pushService = {};

var APP_ID = 'ef898301';
var API_KEY = '92611213d781d26680943ec09d0ba4a6e7741402006d488f';

var PUSH_OPTIONS = {
    host: 'push.ionic.io',
    path: '/api/v1/push',
    //host: 'https://android.googleapis.com',
    //path: '/gcm/send',
    port: '80',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Ionic-Application-Id': APP_ID,
        "Authorization": "Basic " + new Buffer(API_KEY + ":").toString("base64")
    }

};


var prepare_notification = function(tokens, alert_msg, payload) {
    console.log('preparing push msg');
    console.log('tokens:', tokens);
    console.log('payload:', payload);
    return {
        'tokens': tokens, //TODO tokens will be defined on call
        'notification': {
            //'alert': alert_msg, //TODO this will be the message shown in notification
            'alert': payload,
            'ios': {
                "badge":1,
                "sound":"ping.aiff",
                "expiry": 1423238641,
                "priority": 10,
                "contentAvailable": true,
                "payload": payload //TODO this will be the object to be sent to the client
            },
            'android': {
                'message': alert_msg,
                'collapseKey': 'foo',
                'delayWhileIdle': true,
                'timeToLive': 300,
                "payload": payload //TODO this will be the object to be sent to the client
            }
        }
    };
};

pushService.pushTopic = function (topic, tokens) {
    //console.log('topic: ' + JSON.stringify(topic));
    //console.log('tokens:', tokens);

    //var topicNotification = prepare_notification(tokens, ('New Topic: ' + topic.what), topic);

    //var options = PUSH_OPTIONS;

    //var callback = function(res) {
    //    var str = '';
    //    console.log('STATUS: ' + res.statusCode);
    //    console.log('HEADERS: ' + JSON.stringify(res.headers));
    //    res.setEncoding('utf8');
    //    res.on('data', function (chunk) {
    //        console.log('BODY: ' + chunk);
    //    });
    //};

    //var req = http.request(options, callback);
    //req.on('error', function(e) {
    //    console.log('problem with request: ' + e.message);
    //});

    //req.write(JSON.stringify(topicNotification));
    //req.end();
    var message = new gcm.Message();
    message.addData('message', 'You are added to the topic: ' + topic.what);
    message.addData('title', 'Recommender Topic');
    message.addData('msgcnt', '1');
    message.addData('payload', {'$state': 'topic', '$stateParams': JSON.stringify({topic_id: topic._id})});
    message.addNotification('topic', topic);
    message.timeToLive = 3000;

    gcmSender.send(message, tokens, 5, function(result) {
        if(result == null)
            console.log('GCM PUSH topic IS SUCCESSFULLY SENT');
        else
            console.log(result);
    });
};

pushService.pushMessage = function(msg, tokens) {
    // var msgNotification = prepare_notification(tokens, ('New Message from ' + msg.sender.uname), msg);

    // var options = PUSH_OPTIONS;
    // var callback = function(res) {
    //     var str = '';
    //     console.log('STATUS: ' + res.statusCode);
    //     console.log('HEADERS: ' + JSON.stringify(res.headers));
    //     res.setEncoding('utf8');
    //     res.on('data', function (chunk) {
    //         console.log('BODY: ' + chunk);
    //     });
    // };

    // var req = http.request(options, callback);
    // req.on('error', function(e) {
    //     console.log('problem with request: ' + e.message);
    // });

    // req.write(JSON.stringify(msgNotification));

    //req.end();

    /////////////////////////
    var message = new gcm.Message();
    message.addData('message', 'New message is received from ' + msg.sender.uname);
    message.addData('title', 'Recommender Message');
    message.addData('msgcnt', '1');
    message.addNotification('message', msg);
    message.timeToLive = 3000;

    gcmSender.send(message, tokens, 5, function(result) {
        if(result == null)
            console.log('GCM PUSH message IS SUCCESSFULLY SENT');
        else
            console.log(result);
    });
};

module.exports = pushService;
