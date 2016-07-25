angular.module('recommender.db', [
    'recommender.db.topics',
    'recommender.db.responses'
])
.factory('db', function (topics, responses) {
    return {
        topics,
        responses,
    };
});

angular.module('recommender.db.topics', ['db-utils'])
.factory('topics', function (initialize) {
    var dbPath = '/topics';
    var topicStorage = initialize(dbPath);
    return topicStorage;
});

angular.module('recommender.db.responses', ['db-utils'])
.factory('responses', function (initialize) {
    var dbPath = '/responses';
    var responseStorage = initialize(dbPath);
    return responseStorage;
});

angular.module('db-utils', ['LocalForageModule'])
.factory('instance', function ($localForage) {
    return (opts) => {
        try {
            return $localForage.createInstance(opts);
        } catch (e) {
            return $localForage.instance(opts.name ? opts.name : opts);
        }
    };
})
.factory('loadItems', function () {
    return (instance, opts) => {
        var items = [];
        opts = opts || {};
        var iterFn = (() => {
            if (opts.filter) {
                return (val, key) => {
                    if (opts.filter(val)) {
                        items.push(val);
                    }
                };
            } else {
                return (val, key) => {
                    items.push(val);
                };
            }
        }());
        return instance.iterate(iterFn).then(() => items);
    };
})

.factory('initialize', function (instance, loadItems) {
    return (dbPath) => {
        var storage = instance({name: dbPath});
        return {
            save(item) {
                return storage.setItem(item._id, item);
            },
            get(itemId) {
                return storage.getItem(itemId);
            },
            getAll(opts) {
                return loadItems(storage, opts);
            }
        };
    };
});
