var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var trim_spaces = function(_str) {
    return _str.replace(/\s+/g, '');
};

var User = new Schema({
    uname: String,
    phoneNum: {type: String, unique: true, set: trim_spaces},
    registerDate: {type: Date, default: Date.now},
    pushToken: {type: String},
    contacts: [{type: ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('User', User);
