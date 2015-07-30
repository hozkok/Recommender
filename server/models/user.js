var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var User = new Schema({
    uname: String,
    phoneNum: {type: String, unique: true},
    registerDate: {type: Date, default: Date.now},
    pushToken: {type: String},
    contacts: [{type: ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('User', User);
