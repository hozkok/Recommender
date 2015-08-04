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
                models.Message.populate(topic.messages, {
                    path: 'sender',
                    select: 'uname -_id'
                }, function(err, result) {
                    if(err) {
                        console.log('Error when getting message senders\' details.');
                    }
                    console.log(result);
                    process_topic(topic);
                });
            }
        });
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


var new_topic = function(attrs, callback, err_callback) {
    if(!attrs.owner || !attrs.what) {
        console.log('topic owner and what attrs cannot be empty.');
    }
    else {
        attrs.owner = new ObjectId(attrs.owner);
        var topic = new models.Topic(attrs);
        topic.save(function(err) {
            if(err) {
                err_callback(err);
            }
            else {
                console.log('topic:', attrs.what, 'successfully saved into db.');
                callback();
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


var new_message = function(msgObj, success_callback, err_callback) {
    models.Topic
        .findById(msgObj.topic_id)
        .exec(function(err, topic) {
            if(err || !topic) {
                console.log('error when finding topic!');
                err_callback(err);
            }
            else {
                var msg = models.Message({
                    sender: new ObjectId(msgObj.sender_id),
                    text: msgObj.text
                });
                msg.save(function(err, msg) {
                    if(err) {
                        console.log('couldn\'t save the message.');
                        err_callback(err);
                    }
                    else {
                        topic.messages.push(msg);
                        topic.save(function(err) {
                            if(err) {
                                console.log('couldn\'t add message on this topic.');
                                err_callback(err);
                            }
                            else {
                                models.Message.populate(msg, {
                                    path: 'sender',
                                    select: 'uname -_id'
                                }, function(err, result) {
                                    if(err) {
                                        err_callback(err);
                                    }
                                    else {
                                        success_callback(msg);
                                    }
                                });
                            }
                        })
                    }
                });
            }
        });
};


var get_topic_list = function(usr_id, callback) {
    models.Topic
        .find({$or: [{owner: usr_id}, {participants: usr_id}]})
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

// return: array of objects [{ _id, pushToken }]
var get_user_push_tokens = function (numbers, callback) {
    // TODO: find and return the pushTokens for the given numbers
    models.User.find({phoneNum: {$in: numbers}}).select('pushToken')
    .exec(function(err, users) {
        if(err | !users) {
            console.log('cannot find users.');
        }
        else {
            callback(users);
            //var tokens = [];
            //users.forEach(function(user) {
            //    console.log(user.pushToken);
            //    tokens.push(user.pushToken);
            //});
            //console.log('PUSH TOKENS:', tokens);
            //callback(tokens);
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


var check_contacts = function(user_id, contactList, callback) {
    models.User.find({phoneNum: {'$in': contactList}}, function(err, users) {
        var options = {multi: false},
            query = {_id: user_id},
            update = {contacts: users};
        models.User.findOneAndUpdate(query, update, options, function(err, usr) {
            if(err) {
                console.log('check_contacts ERR:', err);
            }
            else {
                callback(users);
            }
        });

    });
};


//TODO: get all contacts of the user
var get_contact_list = function(user_id, callback) {
    console.log('get_contact_list function');
    models.User.findById(user_id)
    .populate('contacts')
    .exec(function(err, user) {
        console.log(user.contacts);
        if(err || !user) {
            console.log('ERR: cannot get contact list of user.');
        }
        else {
            callback(user.contacts);
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
        //      request body includes:  what, where, desc, 
        //                              owner,
        //                              participants: []

        var topic = req.body;
        console.log('\nnew_topic request: ' + JSON.stringify(req.body));

        // Get user push tokens from db using the receivers phone numbers
        // return: array of objects [{ _id, pushToken }]
        get_user_push_tokens(topic.participants, function (users) {
            // Uncomment next line for push tests.
            // push.pushTopic(topic, users.map(function(user) {return user.pushToken}));
            console.log(users);

            topic.participants = users.map(function(user) {return user._id});
            new_topic(topic, 
                //success
                function() {
                    res.sendStatus(200);
                }, function(err) {
                    console.log('new_topic error:', err);
                    res.sendStatus(500);
                }
            );
        });
    },


    new_message: function(req, res) {
        console.log('new_message req:', req.body);
        if(!req.body.text || !req.body.sender_id || !req.body.topic_id)
            res.sendStatus(400);
        else {
            new_message(req.body,
                //success
                function(result) {
                    console.log('message added successfully.');
                    res.json(result)
                },
                //error
                function(err) {
                    res.sendStatus(500);
                }
            );
        }
    },

    
    get_topic_list: function(req, res) {
        console.log('get topics request ->', req.params.usr_id);
        get_topic_list(req.params.usr_id, function(topics) {
            res.json(topics);
        });
    },


    get_topic: function(req, res) {
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
    

    get_contact_list: function(req, res) {
        var user_id = req.params.usr_id;
        console.log('contact list request ->', user_id);
        if(!user_id) {
            console.log('user_id cannot be empty.');
            res.sendStatus(400);
        }
        else {
            get_contact_list(user_id, function(contacts) {
                res.send(contacts);
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
