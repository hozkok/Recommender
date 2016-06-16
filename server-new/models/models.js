const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = mongoose.model('User', {
    uname: String,
    phoneNum: String,
    pushToken: String,
    contacts: [ObjectId] //user ids
});

//const Conversation = mongoose.model('Conversation', {
//    parent: ObjectId, //topic id
//    users: [ObjectId], //user id
//    messages: [{
//        text: String,
//        deliveredTo: [ObjectId] //user id
//    }]
//});

const Topic = mongoose.model('Topic', {
    creator: ObjectId, //user id
    what: String,
    where: String,
    description: String,
    destructTimer: Date,
    conversations: [{
        participant: ObjectId, //user id
        degreeOfSeperation: Number, //distance between two users
        messages: [{
            text: String,
            isSenderOP: Boolean,
            isDelivered: Boolean
        }]
    }]
});

module.exports = {User, Topic};
