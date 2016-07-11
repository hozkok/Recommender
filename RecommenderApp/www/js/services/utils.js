angular.module('recommender.services')
.factory('utils', function ($localForage) {
    return {
        joinPaths(paths) {
            return paths.reduce((acc, curr) =>
                (acc.slice(-1) === '/')
                    ? acc + ((curr.slice(0, 1) === '/')
                        ? curr.slice(1)
                        : curr)
                    : acc + ((curr.slice(0, 1) === '/')
                        ? curr
                        : '/' + curr));
        },

        sequence(jobs) {
            return jobs.reduce(
                (p, job) => p.then
                    ? p.then(job)
                    : p().then(job));
        },

        instance(props) {
            try {
                return $localForage.createInstance(props);
            } catch(e) {
                return $localForage.instance(props.name ? props.name : props);
            }
        },

        loadItems(db, opts) {
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
            })();
            return db.iterate(iterFn).then(() => items);
        },

        //extract date from mongodb object id
        objIdToDate(objId) {
            return new Date(parseInt(objId.substring(0, 8), 16) * 1000);
        },

        // remove an element from array and return it [WARNING: SIDE EFFECT]
        removeOne(arr, queryFn) {
            var i = 0;
            while (i < arr.length) {
                if (queryFn(arr[i])) {
                    return arr.splice(i, 1);
                }
                i = i + 1;
            }
        },
    };
});
