angular.module('recommender.services')
.factory('sync', function ($q, req, dataService, contacts, $localForage, utils) {
    function syncPlaces() {
        return req.get('/where-list')
            .then(httpRes => $localForage.setItem('/where-list',
                                                  httpRes.data));
    }

    function syncTopics() {
        var topicStorage = utils.instance({name: '/topics'});
        return req.get('/topics')
            .then(httpRes => $q.all(httpRes.data
                .map(topic => topicStorage.setItem(topic._id, topic))));
    }

    function syncResponses() {
        var responseStorage = utils.instance({name: '/responses'});
        return req.get('/responses')
            .then(httpRes => $q.all(httpRes.data
                .map(response => topicStorage.setItem(response._id, response))));
    }
    return {
        all() {
            return $q.all([
                contacts.refreshContacts(),
                syncPlaces(),
                syncTopics(),
            ]);
        },
        syncPlaces,
        syncTopics,
        syncResponses,
    };
});
