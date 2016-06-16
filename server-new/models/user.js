const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = mongoose.model('User', {
    uname: {type: String, required: true},
    phoneNum: {type: String, unique: true, required: true},
    pushToken: String,
    contacts: [ObjectId] //user ids
});

module.exports = User;
