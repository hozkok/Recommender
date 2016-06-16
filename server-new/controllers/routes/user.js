const populateUser = require('../../middlewares/populate-user.js');
const router = require('express').Router({
    mergeParams: true
});
const User = require('../../models/user.js');
router.post('/user/register', (req, res, next) => {
    req.checkBody('phoneNum', 'phoneNum missing.').notEmpty();
    req.checkBody('uname', 'uname missing.').notEmpty();
    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
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
    if (!req.user) {
        return res.status(400).send('user not found.');
    }
    req.user.remove()
        .then(result => res.sendStatus(200))
        .catch(err => res.status(500).send(err));
});
router.post('/user/login', (req, res, next) => {
    req.checkBody('phoneNum', 'phoneNum missing.').notEmpty();
    let errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }
    User.findOne({phoneNum: req.body.phoneNum})
        .then(user => {
            if (!user) {
                return res.status(404).send('user not found.');
            }
            res.send(user);
        })
        .catch(err => res.status(500).send(err));
});
router.put('/user/update-push-token', populateUser, (req, res, next) => {
    req.checkBody('pushToken', 'pushToken needed.');
    const errors = req.validationErrors();
    if (!errors) {
        return res.status(400).send(errors);
    }
    req.user.pushToken = req.body.pushToken;
    req.user.save()
        .then(result => res.status(200).send(result))
        .catch(err => res.status(500).send(err));
});
module.exports = router;
