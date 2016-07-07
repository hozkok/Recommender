const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const responseSchema = new Schema({
    parentTopic: {type: ObjectId, required: true}, //topic id
    participant: {type: ObjectId, required: true}, //user id
    addedBy: {type: ObjectId, required: true}, //user id

    // number of times the topic is referenced.
    shareDegree: {type: Number, default: 1, set: (deg => deg + 1)},

    isFulfilled: {type: Boolean, default: false},

    // if participant deletes the response request, this flag sets to true.
    isCancelled: {type: Boolean, default: false},

    isDelivered: {type: Boolean, default: false},

    text: String,
});

responseSchema.index({parentTopic: 1, participant: 1}, {unique: true});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
