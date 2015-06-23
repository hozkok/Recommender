var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var models = require('./models/models');
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
}




module.exports = {
    connect: function() {
        mongoose.connect('mongodb://localhost/recommender');
    },


    new_user: function(name, phone) {
        var usr = new models.User({uname: name, phoneNum: phone});
        usr.save(function(err) {
            if(err) {
                console.log('new_user error:', err);
            }
            else {
                console.log('user: ', name, 'successfully saved into db.');
            }
        });
    },


    get_user: function(phone, process_user) {
        models.User.findOne({phoneNum: phone}).exec(function(err, usr) {
            if(err || !usr) {
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
    },


    new_topic: function(attrs) {
        if(!attrs.owner_phone || !attrs.what) {
            console.log('topic owner_phone and what attrs cannot be empty.');
        }
        models.User
            .findOne({phoneNum: attrs.owner_phone})
            .exec(function(err, usr) {
                if(err)
                    console.log(err);
                else {
                    attrs.owner = usr;
                    var topic = new models.Topic(attrs);
                    topic.save(function(err) {
                    if(err) {
                        console.log('new_topic error:', err);
                    }
                    else {
                        console.log('topic: ', attrs.what, 'successfully saved into db.');
                    }
                });
                }
            });
    },


    new_message: function(topic_id, sender_id, text) {
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
    },

    
    get_topic_data: get_topic
}
