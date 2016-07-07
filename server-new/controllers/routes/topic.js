const Topic = require('../../models/topic.js');
const Conversation = require('../../models/conversation.js');
const Response = require('../../models/response.js');
const populateUser = require('../../middlewares/populate-user.js');
const validator = require('../../middlewares/validators.js');

const router = require('express').Router({
    mergeParams: true
});

router.get('/',
           populateUser,
           (req, res, next) => {
    Topic.find({creator: req.user._id})
        .populate({
            path: 'creator',
            model: 'User',
        })
        .populate({
            path: 'responses',
            model: 'Response',
            populate: {
                path: 'participant',
                model: 'User',
            }
        })
        .then((result) => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});

router.get('/:topicId',
           (req, res) => {
    Topic.findById(req.params.topicId)
        .populate({
            path: 'responses',
            model: 'Response',
            populate: {
                path: 'participant',
                model: 'User',
            }
        })
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => res.status(500).send(err));
});

router.post('/',
            populateUser,
            validator.checkMissings([
                'what', 'where',
                'description', 'participants'
            ]),
            (req, res, next) => {
    const topic = new Topic({
        creator: req.user._id,
        what: req.body.what,
        where: req.body.where,
        description: req.body.description,
        destructDate: req.body.destructDate,
    });
    topic.save()
        // topic is saved.
        .then(savedTopic => {
            const responseReqs = req.body.participants
                .map(p => new Response({
                    participant: p,
                    addedBy: req.user,
                    parentTopic: savedTopic,
                }));
            return Promise.all(responseReqs.map(r => r.save()))
                .then(savedResponseReqs => {
                    savedTopic.responses = savedResponseReqs;
                    return savedTopic.save();
                });
        })
        // all topic response requests are created.
        .then((savedTopic) => {
            return savedTopic.populate({
                path: 'responses',
                model: 'Response',
                populate: {
                    path: 'participant',
                    model: 'User',
                }
            }).execPopulate();
        })
        .then(savedTopic => res.status(200).send(savedTopic))
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

router.delete('/:topicId', (req, res) => {
    var topicId = req.params.topicId;
    Topic.findById(topicId)
        .then(topic => {
            if (!topic) {
                return Promise.reject(res.sendStatus(404));
            }
            return topic.remove()
                .then(result => res.status(200).send(result));
        });
});

module.exports = router;
