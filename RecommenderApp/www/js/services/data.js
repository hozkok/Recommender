angular.module('recommender.services')

.factory('data', function ($localForage) {
// the app data (user data, metadata etc.) will be stored
// in that angular value object.
    var data = {};
    var x = $localForage.createInstance({
        name: 'za',
        storeTable: 'asd'
    });

    function init() {
        return $localForage.getItem('user')
            .then(user => {
                data.user = user;
            });
    }

    return {
        init,

        get(key) {
            return data.key;
        },

        set(key, val) {
            data.key = val;
        }
    };
});
