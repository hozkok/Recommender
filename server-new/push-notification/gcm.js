const gcm = require('node-gcm');

const GCM_KEY = 'AIzaSyAqDHk0h7U27ZBRWcX_leW5aFvh2UTT5MQ';
// const MOBILE_APP_ID = 'ef898301';
// const API_KEY = '92611213d781d26680943ec09d0ba4a6e7741402006d488f';

const config = {
    title: 'Recommender',
    msgcnt: 1,
    priority: 'high',
    contentAvailable: true,
    timeToLive: 3
};

const gcmSender = new gcm.Sender(GCM_KEY);

function prepNotificationFormat({title, body, payload}) {

    // THAT LINE OF CODE WITH NOTIFICATION OBJECT CAUSED ME TO SPEND AT LEAST 6
    // HOURS TO SOLVE PUSH NOTIFICATION EVENT HANDLER TRIGGER PROBLEM!!!!!!!!!!
    //const notification = {title, body, 'content-available': '1'};
    //let pushMsg = Object.assign({}, config, {notification});

    let pushMsg = Object.assign({}, config);
    return (to, data) => {
        let gcmMessage = new gcm.Message(Object.assign({}, pushMsg, {
            data: Object.assign(
                {title, body, payload},
                data
            )
        }));
        console.log(gcmMessage);
        return new Promise((resolve, reject) => {
            gcmSender.send(
                gcmMessage,
                {registrationTokens: to},
                (err, res) => (err ? reject(err) : resolve(res))
            );
        });
    };
}

const pushResponseRequest = prepNotificationFormat({
    title: 'New Response Request',
    body: 'You have a new response request.',
    payload: {
        '$state': 'tab.responses',
        'type': 'response-request'
    }
});

const pushTopicResponse = prepNotificationFormat({
    title: 'New Topic Response',
    body: 'You have a new response for topic.',
    payload: {
        '$state': 'tab.topic',
        '$stateParams': JSON.stringify({id: '<topic id here>'}),
        'type': 'topic-response'
    }
});

module.exports = {pushResponseRequest, pushTopicResponse};
