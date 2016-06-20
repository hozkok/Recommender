const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const Topic = mongoose.model('Topic', {
    creator: {type: ObjectId, required: true}, //user id
    what: {type: String, required: true},
    where: {type: String, required: true},
    description: {type: String, required: true},
    destructTimer: Date,
    conversations: [ObjectId] // conversation id
});

module.exports = Topic;
