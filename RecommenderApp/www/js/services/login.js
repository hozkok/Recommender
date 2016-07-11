angular.module('recommender.services')
.factory('login', function ($q, req) {
    return (credentials => (credentials.uname
        ? req.post('/user/register', credentials)
            .catch(err => $q.reject(err.data ? err.data : err))
        : req.post('/user/login', credentials))
            .then(httpRes => httpRes.data));
});
