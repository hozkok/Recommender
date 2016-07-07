const router = require('express').Router();

//const fs = require('fs');
//const routesPath = __dirname + '/routes/';
//const routeFiles = fs.readdirSync(routesPath);

const userRouter = require('./routes/user'),
      topicRouter = require('./routes/topic.js'),
      conversationRouter = require('./routes/conversation.js'),
      responseRouter = require('./routes/response.js');

router.use('/user', userRouter);
router.use('/topics', topicRouter);
router.use('/conversations', conversationRouter);
router.use('/responses', responseRouter);

router.get('/where-list', (req, res) => {
    res.status(200).send({
        label: "locations",
        counties: [
            "Cork", "Galway", "Mayo", "Donegal", "Kerry", "Tipperary",
            "Clare", "Tyrone", "Antrim", "Limerick", "Roscommon", "Down",
            "Wexford", "Meath", "Londonderry", "Kilkenny", "Wicklow",
            "Offaly", "Cavan", "Waterford", "Westmeath", "Sligo", "Laois",
            "Kildare", "Fermanagh", "Leitrim", "Armagh", "Monaghan",
            "Longford", "Dublin", "Carlow", "Louth"
        ]
    });
});

module.exports = router;
