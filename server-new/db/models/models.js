const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = mongoose.model('User', {
    uname: String,
    phoneNum: String,
    pushToken: String,
});

const Conversation = mongoose.model('Conversation', {
    parent: ObjectId, //topic id
    users: [ObjectId], //user id
    messages: [{
        text: String,
        deliveredTo: [ObjectId] //user id
    }]
});

const Topic = mongoose.model('Topic', {
    creator: ObjectId, //user id
    what: String,
    where: String,
    description: String,
});

module.exports = { User, Topic, Conversation };
