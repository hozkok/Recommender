const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

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

module.exports = Topic;
