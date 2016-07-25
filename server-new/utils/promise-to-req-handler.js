const promiseToReqResHandler = (req, res) => {
    if (!req.passedData.promise) {
        return res.status(500).send('no promise is passed.');
    }
    req.passedData.promise
        .then(result => {
            res.status(200).send(result);
        })
        .catch(err => {
            if (err.code) {
                switch (err.code) {
                case 11000:
                    res.status(400).send('Duplicate key.');
                    break;
                default:
                    res.status(500).send(err);
                }
            } else if (err.status) {
                switch (err.status) {
                case 400:
                case 404:
                    res.status(err.status).send(err.message
                        ? err.message
                        : err);
                    break;
                default:
                    res.status(500).send(err);
                }
            } else {
                res.status(500).send(err);
            }
        });
};

module.exports = promiseToReqResHandler;
