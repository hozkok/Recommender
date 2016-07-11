angular.module('recommender.controllers')
.controller('loginCtrl', function ($scope, login, info, $localForage, $state, dataService, sync) {
    $scope.credentials = {};
    $scope.login = () => {
        var loginAndSyncPromise = login($scope.credentials)
            .then(user => $localForage.setItem('user', user))
            .then(userData => {
                dataService.set('user', userData);
                console.log('dataService set user:', userData);
                return sync.all();
            });
        info.loading(loginAndSyncPromise, {
            successMessage: 'login success.',
            errorMessage: undefined
        }).then(() => {
            console.log('redirecting to tab.topics');
            $state.go('tab.topics');
        }).catch(err => {
            console.log('loginAndSyncPromise err:', err);
        });
    };
});
