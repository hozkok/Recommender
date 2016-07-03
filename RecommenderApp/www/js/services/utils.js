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
        }
    };
});
