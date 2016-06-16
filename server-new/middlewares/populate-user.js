const User = require('../models/user');

module.exports = (req, res, next) => {
    if (!req.body.user) {
        return res.status(400).send('user field empty');
    }

    User.findById(req.body.user._id)
        .then(user => {
            if (!user) {
                return Promise.reject('user not found.');
            }
            req.user = user;
            next();
        })
        .catch(err => next(err));
};
