var db = require('./db');
db.connect();
//db.new_user('TestUser', '0871234567');
// db.new_topic({
//     owner_phone: '0871234567',
//     what: 'kettle',
//     where: 'Galway',
//     description: 'want a cheap one.. mine is just broken.'
// });
//55893b1314b06a670b73e24b

// db.get_user('558932af50fa98f70976ab40');

//// -*-*- INSERT NEW MESSAGE -*-*-
//// params: topic_id, sender_id, text
// db.new_message('55893b1314b06a670b73e24b', 
//         '558932af50fa98f70976ab40', 
//         'hmm, go for HTC... I dunno :/');
//
//// -*-*- INSERT NEW MESSAGE -*-*-
//// params: topic_id, sender_id, text
// db.new_message('55893b1314b06a670b73e24b', 
//         '558932af50fa98f70976ab40', 
//         'The most important thing is software update support!');
//
//// -*-*- INSERT NEW MESSAGE -*-*-
//// params: topic_id, sender_id, text
// db.new_message('55893b1314b06a670b73e24b', 
//         '558932af50fa98f70976ab40', 
//         'just try to stay away from Samsung...');

// -*-*- GET TOPIC DATA -*-*-
// db.get_topic_data('55893b1314b06a670b73e24b',
//         function(topic_data) {
//             console.log(topic_data);
//         }
// );

db.get_user('0871234567', function(usr) {
    db.get_topic_list(usr._id, function(topics) {
        console.log(topics);
    });
});