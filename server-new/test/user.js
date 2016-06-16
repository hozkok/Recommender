const path = require('path');
const server = require('../server');
const supertest = require('supertest');

// it will run before all the tests
let request;
before(() => {
    return require('../server').then(server => {
        request = supertest(server);
    });
});

// it will run after all the tests
after(done => {
    done();
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
        it('should update push token.');
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
        it('should create topic.');
        it('should fail if "what" field is missing.');
        it('should fail if "where" field is missing.');
        it('should fail if "description" field is missing.');
        it('should fail if "participants" field is missing.');
    });

    describe('/:topicId/conversations [POST]', () => {
        it('should create a new conversation with user[s].');
        describe('/:conversationId/messages [POST]', () => {
            it('should post a new message.');
        });
    });
});
