const populateUser = require('../../middlewares/populate-user.js');
const validators = require('../../middlewares/validators.js');
const router = require('express').Router({
    mergeParams: true
});
const User = require('../../models/user.js');

router.post('/register',
            validators.checkMissings(['phoneNum', 'uname']),
            (req, res, next) => {
    const user = new User(req.body);
    user.save()
        .then(result => res.status(200).send(result))
        .catch(err => {
            switch (err.code) {
            case 11000:
                res.status(400).send('duplicate key.');
                break;
            default:
                res.status(500).send(err);
            }
        });
});

router.post('/deregister', populateUser, (req, res, next) => {
    req.user.remove()
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});

router.post('/login',
            validators.checkMissings(['phoneNum']),
            (req, res, next) => {
    User.findOne({phoneNum: req.body.phoneNum})
        .then(user => {
            if (!user) {
                return res.status(404).send('user not found.');
            }
            res.send(user);
        })
        .catch(err => res.status(500).send(err));
});

function putPushToken(req, res, next) {
    req.user.pushToken = req.body.pushToken;
    req.passedData.promise = req.user.save();
    next();
}

router.put('/update-push-token',
           populateUser,
           validators.checkMissings(['pushToken']),
           putPushToken);

router.post('/contacts',
            populateUser,
            validators.checkMissings(['phoneNums']),
            (req, res) => {
    User.find({phoneNum: {$in: req.body.phoneNums}})
        .then(results => {
            req.user.contacts = results;
            return req.user.save();
        })
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});

router.get('/contacts',
           populateUser,
           (req, res) => {
    req.user.populate('contacts').execPopulate()
        .then(user => req.user.contacts.length !== 0
            ? res.status(200).send(user.contacts)
            : res.sendStatus(404))
        .catch(err => res.status(500).send(err));
});

module.exports = router;
