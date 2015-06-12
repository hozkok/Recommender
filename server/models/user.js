var mongoose = require('mongoose');
var User = new mongoose.Schema({
    uname: String,
    password: String,
    phoneNum: String,
    registerDate: Date
});

module.exports = mongoose.model('User', User);
