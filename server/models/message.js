var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Message = new Schema({
    sender: {type: ObjectId, ref: 'User'},
    receiver: {type: ObjectId, ref: 'User'},
    text: String,
    date: {type: Date, default: Date.now},
    isSent: {type: Boolean, default: false}
});

module.exports = mongoose.model('Message', Message);
