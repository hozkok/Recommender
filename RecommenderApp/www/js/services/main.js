angular.module('recommender.services', [])

.value('user', {})

.factory('mainService', function ($q, contacts, login) {

    function initAll(services) {
        return $q.all(services.map(service => service.init()));
    }

    return {
        init() {
            return initAll([
                contacts,
            ]);
        },
    };
});
