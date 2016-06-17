const populateUser = require('../../middlewares/populate-user.js');
const validators = require('../../middlewares/validators.js');
const router = require('express').Router({
    mergeParams: true
});
const User = require('../../models/user.js');

router.post('/user/register',
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

router.post('/user/deregister', populateUser, (req, res, next) => {
    req.user.remove()
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});

router.post('/user/login',
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

router.put('/user/update-push-token',
           populateUser,
           validators.checkMissings(['pushToken']),
           (req, res, next) => {
    req.user.pushToken = req.body.pushToken;
    req.user.save()
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});

module.exports = router;
