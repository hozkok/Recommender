const User = require('../models/user');

module.exports = (req, res, next) => {
    let userId = req.get('x-recommender-user');
    if (!userId) {
        return res.status(400).send('user header empty');
    }

    User.findById(userId)
        .then(user => {
            if (!user) {
                return Promise.reject('user not found.');
            }
            req.user = user;
            next();
        })
        .catch(err => next(err));
};
