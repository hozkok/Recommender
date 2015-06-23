var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var Topic = new Schema({
    owner: {type: ObjectId, ref: 'User'},
    participants: [{type: ObjectId, ref: 'User'}],
    what: String,
    where: String,
    description: String,
    date: {type: Date, default: Date.now},
    messages: [{type: ObjectId, ref: 'Message'}]
    //messages: [{
    //    sender: String,
    //    text: String,
    //    date: {type: Date, default: Date.now},
    //    isSent: {type: Boolean, default: false}
    //}]
});

module.exports = mongoose.model('Topic', Topic);
