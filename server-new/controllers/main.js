const router = require('express').Router();

//const fs = require('fs');
//const routesPath = __dirname + '/routes/';
//const routeFiles = fs.readdirSync(routesPath);

const userRouter = require('./routes/user'),
      topicRouter = require('./routes/topic.js'),
      conversationRouter = require('./routes/conversation.js');

router.use('/user', userRouter);
router.use('/topics', topicRouter);
router.use('/conversations', conversationRouter);

module.exports = router;
