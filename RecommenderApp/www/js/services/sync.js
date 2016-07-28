angular.module('recommender.services')
.factory('sync', function ($q, req, dataService, contacts, $localForage, utils) {
    function syncPlaces() {
        return req.get('/where-list')
            .then(httpRes => $localForage.setItem('/where-list',
                                                  httpRes.data));
    }

    function syncTopic(topicId) {
        topicId = (typeof topicId === 'string') ? topicId : topicId._id;
        var topicStorage = utils.instance({name: '/topics'});
        return req.get('/topics/' + topicId)
            .then(httpRes => {
                return topicStorage.setItem(topicId, httpRes.data);
            });
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
                .map(response => responseStorage.setItem(response._id, response)))
            )
            .catch(err => {
                if (err.status === 404) {
                    return $q.resolve();
                }
                return $q.reject(err);
            });
    }

    return {
        all() {
            var promises = [
                contacts.refreshContacts(),
                syncPlaces(),
                //syncTopics(),
                syncResponses(),
                $localForage.setItem('pushCount', 0)
                //$localForage.removeItem('user')
            ];
            promises.forEach(p => {
                p.then(result => {
                    console.log('sync result:', result);
                    return result;
                }).catch(err => {
                    console.error('sync err:', err);
                    return err;
                });
            });
            return $q.all(promises);
        },
        syncPlaces,
        syncTopics,
        syncResponses,
        syncTopic,
        clear() {
            return $q.all([
                utils.instance({name: '/topics'}).clear(),
                utils.instance({name: '/responses'}).clear()
            ]);
        }
    };
});
