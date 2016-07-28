const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;


//const Response = new Schema({
//    participant: {type: ObjectId, required: true, unique: true}, //user id
//    addedBy: {type: ObjectId, required: true}, //user id
//
//    // number of times the topic is referenced.
//    shareDegree: {type: Number, default: 1, set: (deg => deg + 1)},
//
//    isFulfilled: {type: Boolean, default: false},
//
//    // if participant deletes the response request, this flag sets to true.
//    isCancelled: {type: Boolean, default: false},
//
//    isDelivered: {type: Boolean, default: false},
//
//    text: String,
//});

const topicSchema = new Schema({
    creator: {type: ObjectId, required: true}, //user id
    what: {type: String, required: true},
    where: {type: String, required: true},
    description: {type: String, required: true},
    destructDate: Date,
    responses: [ObjectId] //response id
});

// topicSchema.pre('save', function (next) {
//     this._wasNew = this.isNew;
//     next();
// });
// 
// const pushService = require('../push-notification/gcm');
// topicSchema.post('save', function (topic) {
//     if (!topic._wasNew) {
//         return;
//     }
//     topic.populate({
//         path: 'responses',
//         model: 'Response',
//         populate: {
//             path: 'participant',
//             model: 'User',
//             select: 'pushToken phoneNum'
//         }
//     }).execPopulate().then(topic => {
//         let participants = topic.responses
//             .filter(r => r.participant.pushToken)
//             .map(r => r.participant.pushToken);
//         pushService.pushResponseRequest(participants, {topic})
//             .catch(err => {
//                 console.error('pushResponseRequest error:', err);
//             });
//     });
// });

const Topic = mongoose.model('Topic', topicSchema);

module.exports = Topic;
