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
    return Topic.findById(req.body.parentTopic)
        .then(topic => {
            if (!topic) {
                return res.status(404).send('topic not found.');
            }
            const response = new Response({
                participant: req.body.participant,
                addedBy: req.user,
                parentTopic: req.body.parentTopic,
                shareDegree: req.body.shareDegree,
            });
            return response.save().then(result => [topic, result]);
        })
        .then(([topic, response]) => {
            topic.responses.push(response);
            return topic.save().then(result => response);
        })
        .then(response => res.status(200).send(response))
        .catch(err => res.status(500).send(err));
});

router.put('/:responseId',
           validators.checkMissings(['text']),
           (req, res) => {
    Response.findById(req.params.responseId)
        .then(responseObj => {
            if (!responseObj) {
                return res.sendStatus(404);
            }
            responseObj.text = req.body.text;
            responseObj.isFulfilled = true;
            return responseObj.save().then(result => {
                res.status(200).send(result);
            });
        })
        .catch(err => res.status(500).send(err));
});

router.get('/:responseId',
           (req, res) => {
    Response.findById(req.param.responseId)
        .populate({
            path: 'parentTopic',
            model: 'Topic',
            populate: {
                path: 'responses',
                model: 'Response',
            }
        })
        .populate({
            path: 'addedBy',
            model: 'User',
        })
        .then(response => {
            if (!response) {
                return res.sendStatus(404);
            }
            res.status(200).send(response);
        })
        .catch(err => res.status(500).send(err));
});

router.delete('/:responseId', (req, res) => {
    let responseId = req.params.responseId;
    Response.findById(responseId)
        .then(response => {
            if (!response) {
                return res.sendStatus(404);
            }
            response.isCancelled = true;
            response.save().then(result => {
                res.sendStatus(200);
            });
            //Promise.all([
            //    //response.remove(),
            //    Topic.findByIdAndUpdate(response.parentTopic,
            //                            {$pull: {responses: responseId}})
            //]).then(results => {
            //    console.log(results);
            //    res.sendStatus(200);
            //});
        })
        .catch(err => res.status(500).send(err));
});

router.get('/',
           populateUser,
           (req, res, next) => {
    Response.find({participant: req.user, isDelivered: false})
        .populate({
            path: 'addedBy',
            model: 'User'
        })
        .populate({
            path: 'parentTopic',
            model: 'Topic',
            populate: {
                path: 'creator',
                model: 'User',
            },
            populate: {
                path: 'responses',
                model: 'Response',
                select: 'participant',
            },
        })
        .then(results => {
            if (results.length === 0) {
                return res.sendStatus(404);
            }

            res.status(200).send(results);

            // after results are sent, update their isDelivered flag
            Promise.all(results.map(result => {
                result.isDelivered = true;
                return result.save();
            })).catch(err => {
                console.error(err);
            });
        })
        .catch(err => res.status(500).send(err));
});

module.exports = router;
