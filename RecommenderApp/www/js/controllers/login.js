angular.module('recommender.controllers')
.controller('loginCtrl', function ($scope, login, info, $localForage, $state, data) {
    $scope.credentials = {};
    $scope.login = () => {
        loginAndSavePromise = login($scope.credentials)
            .then(user => $localForage.setItem('user', user));
        info.loading(loginAndSavePromise, {
            successMessage: 'login success.',
            errorMessage: 'could not login.'
        })
        .then(userData => {
            data.user = userData;
            $state.go('topics');
        });
    };
});
