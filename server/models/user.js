var mongoose = require('mongoose');
var User = new mongoose.Schema({
    uname: String,
    phoneNum: {type: String, unique: true},
    registerDate: {type: Date, default: Date.now},
    pushToken: {type: String}
});

module.exports = mongoose.model('User', User);
