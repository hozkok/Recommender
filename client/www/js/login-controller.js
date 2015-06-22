recommender.controller('loginCtrl', function($scope, $resource, db, $state, $http) {
    console.log('login controller is initialized.');
    $scope.user = {};
    $scope.login = function() {
        console.log($scope.user.phone_no, $scope.user.name);
        if(!$scope.user.phone_no) {
            console.log('empty Phone No.');
            return;
        }

        if(!$scope.user.name) {
            console.log('empty Name.');
            return;
        }

        console.log('logging in...');

        SERVER = 'http://localhost:9000';
        $http.post(SERVER + '/login', {
            phoneNumber: $scope.user.phone_no,
            name: $scope.user.name
        }).success(function(response, status, headers, config) {
            db.insert_user($scope.user.phone_no, $scope.user.name).then(function(result) {
                $scope.logged_in = true;
                console.log('successfully logged in.', result);
                $state.go('topics', {phone: $scope.user.phone_no});
            }, function(err) {
                $scope.logged_in = false;
                console.log('an error occured during login.', err);
            });
        }).error(function(response, status, headers, config) { 
            console.log('failed to login to server');
        });
    };
    var user_data = db.get_user_data();
    user_data.then(function(result) {
        if(result.rows.length === 0) {
            console.log('user not found');
            //$state.go('login');
            $scope.logged_in = false;
        }
        else {
            console.log('result:', result);
            $scope.logged_in = true;
        }
    });
});
