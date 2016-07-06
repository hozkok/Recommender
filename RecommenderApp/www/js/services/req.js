angular.module('recommender.services')
.factory('req', function ($http, $q, config, utils, dataService) {
    var baseUrl = config.baseUrl,
        appHeaders = {};

    function prepHeader(obj) {
        var userData = dataService.get('user');
        return Object.assign({}, appHeaders, {
            'x-recommender-user': userData ? userData._id : undefined
        }, obj);
    }

    function post(path, data, opts) {
        path = utils.joinPaths([baseUrl, path]);
        console.log(path, 'POST');
        var httpProps = {
                url: path,
                method: 'POST',
                headers: prepHeader(),
                data,
            };
        return $http(httpProps).catch(err => {
            console.error(err);
            return $q.reject(err);
        });
    }

    function put(path, data, opts) {
        path = utils.joinPaths([baseUrl, path]);
        console.log(path, 'PUT');
        var httpProps = {
                url: path,
                method: 'PUT',
                headers: prepHeader(),
                data,
            };
        return $http(httpProps).catch(err => {
            console.error(err);
            return $q.reject(err);
        });
    }

    return {
        init: function () {
            return;
        },

        post,

        put,

        get(path) {
            path = utils.joinPaths([baseUrl, path]);
            console.log(path, 'GET');
            var httpProps = {
                    url: path,
                    method: 'GET',
                    headers: prepHeader(),
                };
            return $http(httpProps).catch(err => {
                console.error(err);
                return $q.reject(err);
            });
        },
    };
});
