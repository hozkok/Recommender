var mongoose = require('mongoose');
var models = require('./models/models');
// mongoose.connect('mongodb://localhost/recommender');

var db = mongoose.connection;

// error
db.on('error', console.error.bind(console, 'connection error:'));

// success
db.once('open', function(callback) {
    console.log('successfully connected to db.');
});

// TEST
// usr = new models.User({uname: 'asd', password: 'qwe'});
// usr.save();

module.exports = {
    connect: function() {
        mongoose.connect('mongodb://localhost/recommender');
    }
}
