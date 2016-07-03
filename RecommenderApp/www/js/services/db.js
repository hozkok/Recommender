angular.module('recommender.db', ['LocalForageModule'])

.config(function ($localForageProvider) {
    $localForageProvider.config({
        version: 1.0,
        name: 'recommender',
        description: 'recommender offline storage'
    });
})

.factory('db', function ($localForage) {
    var topics, contacts, responses;
    var db = {};
    function init(names) {
        if (names) {
            names.forEach(name => {
                $localForage.createInstance({name});
            });
        } else {
            $localForage.createInstance({name: 'user'});
            $localForage.createInstance({name: 'topics'});
            $localForage.createInstance({name: 'user/contacts'});
            $localForage.createInstance({name: 'user/responses'});
        }
    }

    return {
        init,
        instance(name) {
            return $localForage.instance(name);
        }
    };
});
