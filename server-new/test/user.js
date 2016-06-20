const path = require('path');
const server = require('../server');
const supertest = require('supertest');

let testData = {
    users: [
        {
            uname: 'globalTester1',
            phoneNum: '1111111'
        },
        {
            uname: 'globalTester2',
            phoneNum: '2222222'
        }
    ],
    topic: {
        what: 'testWhat',
        where: 'testWhere',
        description: 'testDescription',
        participants: []
    }
};

let request;
// it will run before all the tests
before(() => {
    return require('../server')
        .then(server => {
            request = supertest(server);
            return Promise.all(testData.users.map(user => new Promise(
                (resolve, reject) => {
                    request.post('/user/register')
                        .send(user)
                        .expect(200)
                        .end((err, res) => {
                            if (err) {
                                reject();
                            } else {
                                user._id = res.body._id;
                                resolve();
                            }
                        });
                }
            )));
        });
});

// it will run after all the tests
after(() => {
    return Promise.all(testData.users.map(user => new Promise(
        (resolve, reject) => {
            request.post('/user/deregister')
                .send({user})
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        reject();
                    } else {
                        delete user._id;
                        resolve();
                    }
                });
        }
    )));
});

describe('/user', () => {
    const uname = 'testUser';
    const phoneNum = '1234567';
    let registeredUserId;
    describe('/register', () => {
        it('should register a new user.', (done) => {
            request.post('/user/register')
                .send({uname, phoneNum})
                .expect(200)
                .expect(res => {
                    if (!res.body) throw Error('user empty.');
                    if (!res.body._id) throw Error('user._id empty.');
                    registeredUserId = res.body._id;
                })
                .end(done);
        });
        it('should not register if fields missing.', done => {
            request.post('/user/register')
                .expect(400, done);
        });
    });

    describe('/login', () => {
        it('should log user in.', done => {
            request.post('/user/login')
                .send({phoneNum}) 
                .expect(200)
                .expect(res => {
                    if (res.body._id !== registeredUserId) {
                        throw Error('_id not match.');
                    }
                })
                .end(done);
        });
    });

    describe('/user/update-push-token', () => {
        it('should update push token.', done => {
            request.put('/user/update-push-token')
                .send({
                    user: {_id: registeredUserId},
                    pushToken: 'samplePushToken'
                })
                .expect(200, done);
        });
    });

    describe('/deregister', () => {
        it('should deregister the user.', done => {
            request.post('/user/deregister')
                .send({user: {_id: registeredUserId}})
                .expect(200, done);
        });
    });
});

describe('/topics', () => {
    describe('/ [POST]', () => {
        const testTopic = {
            user: testData.users[0],
            what: 'testWhat',
            where: 'testWhere',
            description: 'testDescription',
            participants: [testData.users[1]]
        };
        it('should create topic.', done => {
            request.post('/topics/')
                .send(testTopic)
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    done();
                });
        });
        it('should fail if "what" field is missing.');
        it('should fail if "where" field is missing.');
        it('should fail if "description" field is missing.');
        it('should fail if "participants" field is missing.');
    });

    describe('/ [GET]', () => {
        it('should get all the topics of user.', done => {
            request.get('/topics/')
                .send({user: testData.users[0]})
                .expect(200)
                .end((err, res) => {
                    if (err) return done(err);
                    //console.log('res.body:', res.body);
                    done();
                });
        });
    });

    describe('/conversations [POST]', () => {
        it('should create a new conversation with user[s].');
        describe('/:conversationId/messages [POST]', () => {
            it('should post a new message.');
        });
    });
});
