angular.module('recommender.services')
.factory('sync', function ($q, req, dataService, contacts, $localForage) {
    function syncPlaces() {
        return req.get('/where-list')
            .then(httpRes => $localForage.setItem('/where-list', httpRes.data));
    }
    return {
        all() {
            return $q.all([
                contacts.refreshContacts(),
                syncPlaces(),
            ]);
        }
    };
});
