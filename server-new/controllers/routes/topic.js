const Topic = require('../../models/topic.js');
const populateUser = require('../../middlewares/populate-user.js');
const router = require('express').Router({
    mergeParams: true
});
router
    .get('/topics', populateUser, (req, res, next) => {
        Topic.find({owner: req.user._id})
            .then((result) => res.status(200).send(result))
            .catch(err => res.status(500).send(err));
    })
    .post('/topics', populateUser, (req, res, next) => {
        req.checkBody('what', 'what field is missing.').notEmpty();
        req.checkBody('where', 'where field is missing.').notEmpty();
        req.checkBody('description', 'description field is missing.').notEmpty();
        req.checkBody('participants', 'participants field is missing.').notEmpty();
        const errors = req.validationErrors();
        if (errors) {
            return res.status(400).send(errors);
        }
        const topic = new Topic({
            owner: req.user._id,
            what: req.body.what,
            where: req.body.where,
            description: req.body.description,
            participants: req.body.participants
        });
        topic.save().then((result) => {
            res.sendStatus(200);
        }).catch(err => res.status(500).send(err));
    });
module.exports = router;
