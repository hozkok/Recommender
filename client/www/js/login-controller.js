recommender.controller('loginCtrl', function($scope, $resource, db, $state, $http, Login) {
    console.log('login controller is initialized.');
    $scope.user = {};
    $scope.login = function() {
        console.log($scope.user.phone_no, $scope.user.name);
        if(!$scope.user.phone_no) {
            console.log('empty Phone No.');
            return;
        }


        var save_and_go = function(usr) {
            db.insert_user(usr._id, usr.uname, usr.phoneNum)
            .then(function(result) {
                $state.go('topics', {uid: usr._id, phone: usr.phoneNum});
            });
        };


        Login.get({phone_no: $scope.user.phone_no})
        .$promise.then(
            //success
            function(usr) {
                if(usr) {
                    save_and_go(usr);
                }
                else {
                    if(!$scope.user.name) {
                        console.log('name cannot be empty.');
                    }
                    else {
                        Login.save($scope.user).$promise.then(
                            //success
                            function(result) {
                                if(result) {
                                    save_and_go(result);
                                }
                                else {
                                    console.log('something is wrong...');
                                }
                            },
                            //error
                            function(err) {
                                console.log('error', err);
                            }
                        );
                    }
                }
            },
            //error
            function(err) {
                console.log('error:', err);
            }
        );

        //console.log('logging in...');

        //SERVER = 'http://localhost:9000';
        //$http.post(SERVER + '/login', {
        //    phoneNumber: $scope.user.phone_no,
        //    name: $scope.user.name
        //}).success(function(response, status, headers, config) {
        //    db.insert_user($scope.user.phone_no, $scope.user.name).then(function(result) {
        //        $scope.logged_in = true;
        //        console.log('successfully logged in.', result);
        //        $state.go('topics', {phone: $scope.user.phone_no});
        //    }, function(err) {
        //        $scope.logged_in = false;
        //        console.log('an error occured during login.', err);
        //    });
        //}).error(function(response, status, headers, config) { 
        //    console.log('failed to login to server');
        //});
    };

    $scope.existing_login = function() {
        Login.save({asd: 'qwe', qwe: 'qweqwe'}, function(res) {
            console.log(res.a);
        });
        //if($scope.user.phone_no)
        //    Login.get({phone_no: $scope.user.phone_no}, function(user) {
        //        console.log(user);
        //        $state.go('topics', {uid: user._id});
        //    });
    };
});
