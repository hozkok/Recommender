const Topic = require('../../models/topic.js');
const Conversation = require('../../models/conversation.js');
const populateUser = require('../../middlewares/populate-user.js');
const validator = require('../../middlewares/validators.js');

const router = require('express').Router({
    mergeParams: true
});

router.get('/',
           populateUser,
           (req, res, next) => {
    Topic.find({creator: req.user._id})
        .then((result) => res.status(200).send(result))
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
    });
    topic.save()
        // topic is saved.
        .then(savedTopic => {
            const conversations = req.body.participants
                .map(p => new Conversation({
                    participant: p._id,
                    addedBy: req.user._id,
                    parentTopic: savedTopic._id,
                }));
            return Promise.all([savedTopic, ...conversations.map(c => c.save())]);
        })
        // all topic conversations are created.
        .then(([savedTopic, ...savedConversations]) => {
            res.status(200).send({savedTopic, savedConversations});
        })
        .catch(err => {
            console.error(err);
            res.status(500).send(err);
        });
});

module.exports = router;
