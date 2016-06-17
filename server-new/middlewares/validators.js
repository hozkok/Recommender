module.exports = {checkMissings};

function checkMissings(keys) {
    return (req, res, next) => {
        keys.forEach(key => {
            req.checkBody(key, `${key} is empty.`).notEmpty();
        });
        const errors = req.validationErrors();
        if (errors) {
            res.status(400).send(errors);
        } else {
            next();
        }
    };
}
