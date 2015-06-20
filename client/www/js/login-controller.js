recommender.controller('loginCtrl', ['$scope', '$resource', 'db', '$state', function($scope, $resource, db, $state) {
    $scope.login = function() {
        if($scope.phone_no) {
            console.log('logging in...');
            db.insert_user($scope.phone_no).then(function(result) {
                $scope.logged_in = true;
                console.log('successfully logged in.', result);
            }, function(err) {
                $scope.logged_in = false;
                console.log('an error occured during login.', err);
            });
        }
        else {
            console.log('empty phone number');
        }
    };
    var user_data = db.get_user_data();
    user_data.then(function(result) {
        if(result.rows.length === 0) {
            console.log('user not found');
            //$state.go('login');
            $scope.logged_in = false;
        }
        else {
            console.log(result);
            $scope.logged_in = true;
        }
    });
}]);
