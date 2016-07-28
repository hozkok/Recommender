angular.module('recommender.services', [])

.factory('mainService', function ($q, contacts, login, dataService, pushNotification) {

    function initAll(services) {
        return $q.all(services.map(service => service.init()));
    }

    return {
        init() {
            return initAll([
                dataService
            ]);
        },
        initUser() {
            if (!dataService.get('user')) {
                return $q.reject('user not found.');
            }
            return initAll([
                pushNotification
            ]);
        }
    };
});
