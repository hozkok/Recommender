angular.module('recommender.services', [])

.factory('mainService', function ($q, contacts, login, data) {

    function initAll(services) {
        return $q.all(services.map(service => service.init()));
    }

    return {
        init() {
            return initAll([
                contacts,
                data,
            ]);
        },
    };
});
