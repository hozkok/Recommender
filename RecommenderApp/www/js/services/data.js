angular.module('recommender.services')

.factory('dataService', function ($localForage) {
// the app data (user data, metadata etc.) will be stored
// in that angular value object.
    var data = {};

    function init() {
        return $localForage.getItem('user')
            .then(user => {
                data.user = user;
            });
    }

    return {
        init,

        get(key) {
            return data[key];
        },

        set(key, val) {
            data[key] = val;
        }
    };
});
