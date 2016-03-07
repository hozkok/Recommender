var Topic = require('./models/topic.js');
var Message = require('./models/message.js');

var CHECK_INTERVAL = 60; // seconds

var check_topics = function () {
    var now = Date.now();
    Topic.find({destruct_date: {$lt: now}}).select('destruct_date messages')
    .exec(function (err, topics) {
        if (err) {
            console.log('destroy err:', err);
            return err;
        }
        console.log('topics to destroy:', topics);
        topics.forEach(function (topic) {
            Message.remove({_id: {$in: topic.messages}}, function (err) {
                topic.remove(function (err) {
                    if (err) {
                        console.log('check_topics remove topic err:', err);
                        return err;
                    }
                });
            });
        });
    });
};
module.exports = {
    init: function () {
        setInterval(check_topics, CHECK_INTERVAL * 1000);
    }
};
