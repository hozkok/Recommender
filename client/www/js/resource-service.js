recommender.factory('Topics', ['$resource', function($resource) {
    return $resource('http://localhost:9000/topics/:user_id');
}]);

recommender.factory('Login', ['$resource', function($resource) {
    return $resource('http://localhost:9000/login/:phone_no');
}]);