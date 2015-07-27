var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;


var prep_date = function(days) {
    if(Number(days) === 0)
        return;

    var today = new Date();
    today.setTime(today.getTime() + (days * 86400000));
    return today;
};


var Topic = new Schema({
    owner: {type: ObjectId, ref: 'User'},
    participants: [{type: ObjectId, ref: 'User'}],
    what: String,
    where: String,
    description: String,
    date: {type: Date, default: Date.now},
    messages: [{type: ObjectId, ref: 'Message'}],
    destruct_date: {type: Date, set: prep_date}
});

module.exports = mongoose.model('Topic', Topic);
