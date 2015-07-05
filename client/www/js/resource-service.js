recommender.factory('Topics', ['$resource', function($resource) {
    return $resource('http://localhost:9000/topics/:user_id');
}]);

recommender.factory('Login', ['$resource', function($resource) {
    return $resource('http://localhost:9000/user/:user_id', null, {
        'update': {method: 'PUT'}
    });
}]);

recommender.factory('Topic', ['$resource', function($resource) {
    return $resource('http://localhost:9000/topic/:topic_id');
}]);

recommender.factory('Message', ['$resource', function($resource) {
    return $resource('http://localhost:9000/message');
}]);
