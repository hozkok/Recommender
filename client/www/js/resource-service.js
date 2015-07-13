recommender.constant('BACKEND', {
    //url: 'http://46.101.24.174:9000'
    url: 'http://localhost:9000'
});

recommender.factory('Topics', ['$resource', 'BACKEND', function($resource, BACKEND) {
    return $resource(BACKEND.url + '/topics/:user_id');
}]);

recommender.factory('Login', ['$resource', 'BACKEND', function($resource, BACKEND) {
    return $resource(BACKEND.url + '/user/:user_id', null, {
        'update': {method: 'PUT'}
    });
}]);

recommender.factory('Topic', ['$resource', 'BACKEND', function($resource, BACKEND) {
    return $resource(BACKEND.url + '/topic/:topic_id');
}]);

recommender.factory('Message', ['$resource', 'BACKEND', function($resource, BACKEND) {
    return $resource(BACKEND.url + '/message');
}]);
