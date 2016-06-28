angular.module('recommender.services')
.factory('req', function ($http, $q, config, utils) {
    var baseUrl = config.baseUrl,

        post = function (path, data, opts) {
            console.log(utils.joinPaths([baseUrl, path]));
            var httpProps = {
                    url: utils.joinPaths([baseUrl, path]),
                    method: 'POST',
                    data: data
                };
            return $http(httpProps);
        };

    return {
        init: function () {
            return;
        },

        post,

        get(path) {
            var headers = Object.assign({}, appHeaders),
                httpProps = {
                    url: utils.joinPaths([baseUrl, path]),
                    method: 'GET',
                };
            return $http(httpProps);
        },
    };
});
