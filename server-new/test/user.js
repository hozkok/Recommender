const request = require('supertest');
const path = require('path');

const basePath = '/';


let server;

// it will run before all the tests
before(() => {
    return require('../server').then(_server => {
        server = _server;
    });
});

// it will run after all the tests
after(done => {
    done();
});

describe('User', () => {

    describe('register', () => {
        it('should register the user.', done => {
            request(server)
                .post('/test')
                .expect(200, done);
        });
        it('should update user token.');
    });

});

describe('Topic', () => {
    describe('create', done => {
        it('should create topic.');
        it('should not create topic if no participant selected.');
        it('should not create topic if fields missing.');
    });
    describe('delete', done => {
        it('should delete the topic.');
    });
});
