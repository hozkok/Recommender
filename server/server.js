var express = require('express');
var body_parser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./db');
var bodyParser = require('body-parser');

db.connect();


var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
};

app = express()
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 9000;

var router = express.Router();


router.get('/', function(req, res) {
    res.json({ message: 'server is up' });   
});

app.get('/login/:phone_no', function(req, res) {
    db.get_user(req.params.phone_no, function(user) {
        res.send(user);
    });
});


app.post('/login', function(req, res) {
    console.log('login post request', req.body);
    db.new_user(req.body.name, req.body.phone_no, function(user) {
        res.send(user);
    });
});


app.get('/topics/:usr_id', function(req, res) {
    console.log('new topics request->', req.params.usr_id);
    db.get_topic_list(req.params.usr_id, function(topics) {
        console.log(topics);
        res.send(topics);
    });
});

app.use('/api', router);

app.route('/login')
.post(function (req, res) {
	console.log('login request, phoneNumber: ' + req.body.phoneNumber);
	// TODO: add phoneNumber to the DB
	res.sendStatus(200);
});

app.listen(port);

console.log('server started');
