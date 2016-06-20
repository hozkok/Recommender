const
    router = require('express').Router({
        mergeParams: true
    }),
    populateUser = require('../../middlewares/populate-user.js'),
    Conversation = require('../../models/conversation.js'),
    validators = require('../../middlewares/validators.js');

router.post('/',
            populateUser,
            validators.checkMissings([
                'participant', 'addedBy', 'parentTopic']),
            (req, res, next) => {
    const conversation = new Conversation({
        participant: req.body.participant,
        addedBy: req.user,
        parentTopic: req.body.parentTopic,
        shareDegree: req.body.shareDegree
    });
    conversation.save()
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});

router.param('conversationId', (req, res, next, id) => {
    Conversation.findById(id)
        .then(result => {
            if (!result) {
                return res.sendStatus(404);
            }
            req.conversation = result;
            next();
        })
        .catch(err => res.status(500).send(err));
});

router.get('/:conversationId',
           (req, res, next) => 
               res.status(200).send(req.conversation));

router.post('/:conversationId/messages',
            (req, res, next) => {
    req.conversation.messages.push(req.body);
    req.conversation.save()
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});

module.exports = router;
