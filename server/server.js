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


app.route('/user/:user_id?')
    .get(db.get_user)
    .post(db.new_user)
    .put(db.update_user);

// app.get('/login/:phone_no', db.get_user);
// app.post('/login', db.new_user);

app.route('/topics/:usr_id?')
    .get(db.get_topic_list)
    .post(db.new_topic);


app.route('/topic/:topic_id?')
    .get(db.get_topic);


app.route('/message')
    .post(db.new_message);


app.route('/contacts/:usr_id?')
    .post(db.get_contact_list)
    .get(db.get_contact_list);


app.use('/api', router);

// app.route('/login')
// .post(function (req, res) {
// 	console.log('login request, phoneNumber: ' + req.body.phoneNumber);
// 	// TODO: add phoneNumber to the DB
// 	res.sendStatus(200);
// });

app.listen(port);

console.log('server started');
