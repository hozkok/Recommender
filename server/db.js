var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var models = require('./models/models');
var push = require('./push');

// mongoose.connect('mongodb://localhost/recommender');

var db = mongoose.connection;

// error
db.on('error', console.error.bind(console, 'connection error:'));

// success
db.once('open', function(callback) {
    console.log('successfully connected to db.');
});

// TEST
// usr = new models.User({uname: 'asd', password: 'qwe'});
// usr.save();


var get_topic = function(topic_id, process_topic) {
    models.Topic
        .findOne({_id: topic_id})
        .populate('messages')
        .populate('owner')
        .exec(function(err, topic) {
            if(err || !topic) {
                console.log('couldn\'t get the topic ->', topic_id);
            }
            else {
                process_topic(topic);
            }
        })
};


var get_user = function(phone, process_user) {
    models.User.findOne({phoneNum: phone}).exec(function(err, usr) {
        if(err) {
            console.log('cannot get user with phone no:', phone);
        }
        else {
            if(process_user) {
                process_user(usr);
            }
            else {
                console.log('get_user: no callback function is specified.');
            }
        }
    });
};


var new_topic = function(attrs) {
    if(!attrs.owner || !attrs.what) {
        console.log('topic owner and what attrs cannot be empty.');
    }
    else {
        attrs.owner = new ObjectId(attrs.owner);
        var topic = new models.Topic(attrs);
        topic.save(function(err) {
            if(err) {
                console.log('new_topic error:', err);
            }
            else {
                console.log('topic:', attrs.what, 'successfully saved into db.');
            }
        });
    }
};


var new_user = function(name, phone, callback) {
    var usr = new models.User({uname: name, phoneNum: phone});
    usr.save(function(err) {
        if(err) {
            console.log('new_user error:', err);
        }
        else {
            console.log('user:', name, 'successfully saved into db.');
        }
        get_user(phone, callback);
    });
};


//var new_topic = function(attrs) {
//    if(!attrs.owner || !attrs.what) {
//        console.log('topic owner and what attrs cannot be empty.');
//    }
//    else {
//        attrs.owner = new ObjectId(attrs.owner);
//        var topic = new models.Topic(attrs);
//        topic.save(function(err) {
//            if(err) {
//                console.log('new_topic error:', err);
//            }
//            else {
//                console.log('topic:', attrs.what, 'successfully saved into db.');
//            }
//        });
//    }
//};


var new_message = function(topic_id, sender_id, text) {
    models.Topic
        .findOne({_id: new ObjectId(topic_id)})
        .populate('messages')
        .exec(function(err, topic) {
            if(err || !topic) {
                console.log('error when finding topic!');
            }
            else {
                var msg = models.Message({
                    sender: new ObjectId(sender_id),
                    text: text
                });
                msg.save(function(err, msg) {
                    if(err) console.log(err);
                    else {
                        topic.messages.push(msg);
                        topic.save(function(err) {
                            if(err) {
                                console.log('couldn\'t add message on this topic.');
                            }
                            else {
                                console.log('message added successfully.');
                            }
                        })
                    }
                });
            }
        });
};


var get_topic_list = function(usr_id, callback) {
    models.Topic
        .find({owner: usr_id})
        .populate('owner')
        .exec(function(err, topics) {
            if(err || !topics) {
                console.log('couldn\'t find topics for specified user.');
            }
            else {
                if(callback) {
                    callback(topics);
                }
                else {
                    console.log('you need to pass callback function!');
                }
            }
        });
};

var get_user_push_tokens = function (numbers, callback) {
    // TODO: find and return the pushTokens for the given numbers
    models.User.find({phoneNum: {$in: numbers}}, function(err, users) {
        if(err | !users) {
            console.log('cannot find users.');
        }
        else {
            var tokens = [];
            users.forEach(function(user) {
                console.log(user.pushToken);
                tokens.push(user.pushToken);
            });
            console.log('PUSH TOKENS:', tokens);
            callback(tokens);
        }
    });

    // To test, replace this with the token in your browser console.
    // callback(['DEV-43bd86e6-4d68-42ff-993b-b18208b31e88']);
};


var update_user = function(user_id, update_obj, callback) {
    models.User.findById(user_id, function(err, user) {
        if(err || !user) {
            console.log('error:', err);
        }
        else {
            user.uname = update_obj.uname || user.uname;
            user.phoneNum = update_obj.phoneNum || user.phoneNum;
            user.pushToken = update_obj.pushToken || user.pushToken;
            user.save(function(err) {
                if(err) {
                    console.log('error', err);
                }

                if(callback) callback();
            });
        }
    });
};


module.exports = {
    connect: function() {
        mongoose.connect('mongodb://localhost/recommender');
    },


    new_user: function(req, res) {
        console.log('new user request ->', req.body);
        new_user(req.body.name, req.body.phone_no, function(user) {
            res.json(user);
        });
    },


    get_user: function(req, res) {
        var phone_no = req.query.phone_no;
        console.log('get user request ->', phone_no);
        if(!phone_no) {
            console.log('phone_no cannot be empty!');
            res.sendStatus(400);
        }
        else {
            get_user(phone_no, function(user) {
                var uid = user && user._id;
                console.log('get user response ->', uid);
                (user) ? res.json(user) : res.sendStatus(404);
            });
        }
    },

    
    update_user: function(req, res) {
        var user_id = req.params.user_id;
        console.log('put user request ->', user_id);
        if(!user_id) {
            console.log('user_id cannot be empty!');
            res.sendStatus(400);
        }
        else {
            update_user(user_id, req.body, function() {
                console.log(user_id, 'is updated.');
                res.sendStatus(200);
            });
        }
    },


    new_topic: function(req, res) {
        //TODO: check request body and construct new topic. (new_topic func is defined)
        //      request body includes:  topic (what, where, desc), 
        //                              receivers

        console.log('\nnew_topic request: ' + JSON.stringify(req.body));

        // Get user push tokens from db using the receivers phone numbers
        get_user_push_tokens(req.body.receivers, function (tokens) {
            // Uncomment next line for push tests.
            // push.pushTopic(req.body.topic, tokens);
            res.sendStatus(200);
        });
    },


    new_message: function(req, res) {
        //TODO: insert new message on topic. (new_message func is defined)
    },

    
    get_topic_list: function(req, res) {
        console.log('get topics request ->', req.params.usr_id);
        get_topic_list(req.params.usr_id, function(topics) {
            res.json(topics);
        });
    },


    get_topic: function(req, res) {
        //TODO: get requested topic and send a response. (get_topic func is defined, use it)
        var topic_id = req.params.topic_id;
        if(!topic_id) {
            res.sendStatus(400);
        }
        else {
            get_topic(topic_id, function(topic) {
                console.log('get topic response ->', topic && topic._id);
                (topic) ? res.json(topic) : res.sendStatus(404);
            });
        }
    },


    raw: {
        new_user: new_user,
        get_user: get_user,
        new_topic: new_topic,
        new_message: new_message,
        get_topic_list: get_topic_list,
        get_topic: get_topic
    }
};
