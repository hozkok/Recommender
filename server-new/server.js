const
    express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    logger = require('morgan'),
    expressValidator = require('express-validator'),
    compress = require('compression'),
    dotenv = require('dotenv');

mongoose.Promise = Promise;

dotenv.config({path: '.env-variables'});

const server = express();

// allow cross domain requests.
server.use(require('./utils/allow-cors.js'));

switch (process.env.NODE_ENV) {
case 'test':
    const errorHandler = require('errorhandler');
    server.use(errorHandler());
    server.use(logger('dev'));
    break;
case 'production':
    server.use(logger('combined', {
        stream: './log/all.log'
    }));
    break;
default:
    throw Error('invalid NODE_ENV');
}

server.set('port', process.env.PORT || 8000);

server.use(compress());
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
server.use(expressValidator());

server.use('/', require('./controllers'));

module.exports = mongoose.connect(process.env.MONGO_PATH)
    .then(() => new Promise((resolve ,reject) => {
        server.listen(server.get('port'), err => {
            if (err) {
                console.error(`an error occured: ${err}`);
                reject(err);
            } else {
                console.log('server started listening at port:',
                            server.get('port'));
                resolve(server);
            }
        });
    }));
