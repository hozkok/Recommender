const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const topicSchema = new Schema({
    creator: {type: ObjectId, required: true}, //user id
    what: {type: String, required: true},
    where: {type: String, required: true},
    description: {type: String, required: true},
    destructDate: Date,
    responses: [ObjectId] // response id
});

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
