recommender.factory('LocationService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
    var url = (ionic.Platform.isAndroid()) ?
        '/android_asset/www/data/locations.json' : '/data/locations.json';
    var locations = null;
    var running_fn = null;

    $http.get(url).
        success(function(data) {
            locations = data.counties;
            locations.sort(function(comparable1, comparable2) {
                var result = 0;
                var c1 = comparable1.toLowerCase();
                var c2 = comparable2.toLowerCase();

                if(c1 < c2)
                    result = -1;
                else if(c1 > c2)
                    result = 1;

                return result;
            });
        });


    var find_locations = function(search_txt) {
        var deferred = $q.defer();

        if(locations === null) {
            console.log('locations are not loaded.');
            deferred.reject('locations are not loaded.');
            return;
        }

        if(running_fn) {
            console.log('cancelled timeout.');
            $timeout.cancel(running_fn);
            running_fn = null;
        }

        running_fn = $timeout(function() {
            deferred.resolve(locations.filter(function(loc) {
                return loc.toLowerCase().indexOf(search_txt.toLowerCase()) !== -1;
            }));
        }, 300);

        return deferred.promise;
    };


    return {
        find_locations: find_locations,
    };
}]);
