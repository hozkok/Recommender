const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Conversation = mongoose.model('Conversation', {
    // participant who will send messages to topic creator.
    participant: {type: ObjectId, required: true}, //user id

    // user who added participant to the topic.
    addedBy: {type: ObjectId, required: true}, //user id

    parentTopic: {type: ObjectId, required: true}, //topic id

    // number of times the topic is referenced.
    shareDegree: {type: Number, default: 1, set: (deg => deg + 1)},

    messages: [{
        text: {type: String, required: true},
        sender: {type: ObjectId, required: true},
        isDelivered: Boolean
    }]
});

module.exports = Conversation;
