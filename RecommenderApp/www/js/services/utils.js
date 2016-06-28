angular.module('recommender.services')
.factory('utils', function () {
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
    };
});
