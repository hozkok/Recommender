angular.module('recommender.services')
.factory('login', function ($q, req) {
    return (credentials => (credentials.uname
        ? req.post('/user/register', credentials)
        : req.post('/user/login', credentials))
            .then(httpRes => httpRes.data));
});
