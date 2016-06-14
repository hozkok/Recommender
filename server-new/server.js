const
    express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    expressValidator = require('express-validator'),
    compress = require('compression')
    dotenv = require('dotenv');

dotenv.config({path: '.env-variables'});

const server = express();

const db = require('./db');

server.set('port', process.env.PORT || 8000);

server.use(compress());
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

server.post('/test', (req, res) => {
    res.sendStatus(200);
});

module.exports = mongoose.connect(process.env.MONGO_PATH)
    .then(() => new Promise((resolve ,reject) => {
        server.listen(server.get('port'), err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    }))
    .then(() => {
        console.log(`server started listening at port: ${server.get('port')}`);
        return server;
    })
    .catch(err => {
        console.error(`an error occured: ${err}`);
    });
