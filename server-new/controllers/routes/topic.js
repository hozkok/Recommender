const Topic = require('../../models/topic.js');
const User = require('../../models/user.js');
const Conversation = require('../../models/conversation.js');
const Response = require('../../models/response.js');
const populateUser = require('../../middlewares/populate-user.js');
const validator = require('../../middlewares/validators.js');

const pushNotification = require('../../push-notification/gcm');

const router = require('express').Router({
    mergeParams: true
});

router.get('/',
           populateUser,
           (req, res, next) => {
    req.passedData.promise = Topic.find({creator: req.user._id})
        .populate({
            path: 'creator',
            model: 'User',
        })
        .populate({
            path: 'responses',
            model: 'Response',
            populate: {
                path: 'participant',
                model: 'User'
            }
        });
    next();
});

router.get('/:topicId',
           (req, res, next) => {
    req.passedData.promise = Topic.findById(req.params.topicId)
        .populate({
            path: 'responses',
            model: 'Response',
            populate: {
                path: 'participant',
                model: 'User',
            }
        });
    next();
});


router.post('/',
            populateUser,
            validator.checkMissings([
                'what', 'where',
                'description', 'participants'
            ]),
            (req, res, next) => {
    const topic = new Topic({
        creator: req.user,
        what: req.body.what,
        where: req.body.where,
        description: req.body.description,
        destructDate: req.body.destructDate,
    });
    const responses = req.body.participants.map(p =>
        new Response({
            participant: p,
            addedBy: req.user,
            parentTopic: topic,
        })
    );
    topic.responses = responses;
    req.passedData.promise =
        Promise.all([topic.save(), ...responses.map(r => r.save())])
            .then(([topic, ...responses]) => {
                return topic.populate({
                    path: 'responses',
                    model: 'Response',
                    populate: {
                        path: 'participant',
                        model: 'User'
                    }
                }).execPopulate();
            });
    next();
});

router.delete('/:topicId', (req, res, next) => {
    var topicId = req.params.topicId;
    req.passedData.promise = Topic.findById(topicId)
        .then(topic => topic
            ? topic.remove()
            : Promise.reject({
                status: 404,
                message: 'Not found.'
            })
        );
    next();
});

router.post('/:topicId/push-to/:phoneNum', (req, res, next) => {
    let {topicId, phoneNum} = req.params;
    req.passedData.promise = Topic.findById(req.params.topicId)
        .then(topic => {
            if (!topic) {
                return;
            }
            return User.findOne({phoneNum})
                .then(user => {
                    return user && user.pushToken
                        ? pushNotification.pushResponseRequest(
                            [user.pushToken],
                            {topic})
                        : 'pushToken not found.';
            });
        });
    next();
});

module.exports = router;
