var http = require('http');

var pushService = {};

var APP_ID = 'ef898301';
var API_KEY = '92611213d781d26680943ec09d0ba4a6e7741402006d488f';

pushService.pushTopic = function (topic, tokens) {
       	console.log('topic: ' + JSON.stringify(topic));
        console.log('tokens:', tokens);

       	var topicNotification = {
               	"tokens": tokens,
               	"notification":{
                       	"alert": 'New Topic:' + topic,
                       	"ios": {
                               	"badge":1,
                               	"sound":"ping.aiff",
                               	"expiry": 1423238641,
                               	"priority": 10,
                               	"contentAvailable": true,
                               	"payload":{
                                       	"key1":"value",
                                       	"key2":"value"
                               	}
                       	}, 
                       	"android": {
                               	"collapseKey":"foo",
                               	"delayWhileIdle":true,
                               	"timeToLive":300,
                               	"payload":{
                                       	"key1":"value",
                                       	"key2":"value"
                               	}
                       	}
               	}
       	};

       	var options = {
               	host: 'push.ionic.io',
               	path: '/api/v1/push',
               	port: '80',
               	method: 'POST',
               	headers: {
                       	'Content-Type': 'application/json',
                       	'X-Ionic-Application-Id': APP_ID,
                       	"Authorization": "Basic " + new Buffer(API_KEY + ":").toString("base64"),
               	}
       	};

       	callback = function(res) {
               	var str = '';
               	console.log('STATUS: ' + res.statusCode);
               	console.log('HEADERS: ' + JSON.stringify(res.headers));
               	res.setEncoding('utf8');
               	res.on('data', function (chunk) {
                       	console.log('BODY: ' + chunk);
               	});
       	};

       	var req = http.request(options, callback);
       	req.on('error', function(e) {
               	console.log('problem with request: ' + e.message);
       	});

       	req.write(JSON.stringify(topicNotification));
       	req.end();
};

module.exports = pushService;
