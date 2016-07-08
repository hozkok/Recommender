const
    router = require('express').Router({
        mergeParams: true
    }),
    populateUser = require('../../middlewares/populate-user.js'),
    Response = require('../../models/response.js'),
    Topic = require('../../models/topic.js'),
    validators = require('../../middlewares/validators.js');

router.post('/',
            populateUser,
            validators.checkMissings([
                'participant', 'parentTopic', 'shareDegree'
            ]),
            (req, res, next) => {
    req.passedData.promise = Topic.findById(req.body.parentTopic)
        .then(topic => {
            if (!topic) {
                return Promise.reject({
                    status: 404,
                    message: 'parentTopic not found.'
                });
            }
            const response = new Response({
                participant: req.body.participant,
                addedBy: req.user,
                parentTopic: req.body.parentTopic,
                shareDegree: req.body.shareDegree,
            });
            return Promise.all([topic, response.save()]);
        })
        .then(([topic, response]) => {
            topic.responses.push(response);
            return topic.save().then(result => response);
        });
    next();
});

router.put('/:responseId',
           validators.checkMissings(['text']),
           (req, res, next) => {
    let responseId = req.params.responseId;
    req.passedData.promise = Response.findById(responseId)
        .then(response => {
            if (!response) {
                return Promise.reject({
                    status: 404,
                    message: 'Not found.'
                });
            }
            response.text = req.body.text;
            response.isFulfilled = true;
            return response.save();
        });
    next();
});

router.get('/:responseId',
           (req, res, next) => {
    let responseId = req.params.responseId;
    Response.findById(responseId)
        .populate({
            path: 'addedBy',
            model: 'User'
        })
        .then(response => {
            if (!response) {
                return Promise.reject({
                    status: 404,
                    message: 'Response not found.'
                });
            }
            return Topic.findById(response.parentTopic)
                .then(topic => {
                    if (!topic) {
                        return Promise.reject({
                            status: 404,
                            message: 'parentTopic not found.'
                        });
                    }
                    response.parentTopic = topic;
                    return response;
                });
        });
    next();
});

router.delete('/:responseId', (req, res, next) => {
    let responseId = req.params.responseId;
    req.passedData.promise = Response.findById(responseId)
        .then(response => {
            if (!response) {
                return Promise.reject({
                    status: 404,
                    message: 'Not found.'
                });
            }
            response.isCancelled = true;
            return response.save();
        });
    next();
});

router.get('/',
           populateUser,
           (req, res, next) => {
    req.passedData.promise = Response.find({
        participant: req.user,
        isDelivered: false
    }).then(responses => {
        if (responses.length === 0) {
            return Promise.reject({
                status: 404,
                message: 'Not found.'
            });
        }
        Promise.all(responses.map(response => {
            response.isDelivered = true;
            return response.save();
        })).catch(err => {
            console.error('update isDelivered error:', err);
        });

        return Promise.all(responses.map(response => {
            return Promise.all([
                response.populate({
                        path: 'addedBy',
                        model: 'User',
                    }).execPopulate(),
                Topic.findById(response.parentTopic)
                    .populate({
                        path: 'creator',
                        model: 'User'
                    })
                    .populate({
                        path: 'responses',
                        model: 'Response',
                        select: 'participant'
                    })
            ]).then(([response, topic]) => {
                if (!topic) {
                    return;
                }
                return {
                    _id: response._id,
                    parentTopic: topic,
                    shareDegree: response.shareDegree,
                    participant: response.participant,
                    addedBy: response.addedBy,
                };
            });
        })).then(results => {
            results = results.filter(r => r !== undefined);
            return (results.length === 0)
                ? Promise.reject({
                    status: 404,
                    message: 'No response with valid topic found.'
                })
                : results;
        });
    });
    next();
});

module.exports = router;
