recommender.value('userData', {});
recommender.controller('loginCtrl',
['$scope', '$resource', 'db', '$state', '$http', '$rootScope', '$ionicPush', 'Login', 'userData',
function($scope, $resource, db, $state, $http, $rootScope, $ionicPush, Login, userData) {
    console.log('login controller is initialized.');
    $scope.user = {};

    //var pushRegister = function () {
    //    $rootScope.$on('$cordovaPush:tokenReceived', function(event, data) {
    //        console.log('Ionic Push: Got token ', data.token, data.platform);
    //        $scope.user.pushToken = data.token;
    //    });

    //    $ionicPush.register({
    //        canShowAlert: true, 
    //        canSetBadge: true, 
    //        canPlaySound: true,
    //        canRunActionsOnWake: true, 
    //        // TODO: OnNotification should be a function somewhere else,
    //        //       we need to think about how to handle this
    //        onNotification: function(notification) {
    //            console.log('notification: ', notification.message);
    //            return true;
    //        }
    //    });
    //};

    //pushRegister();


    $scope.login = function() {
        console.log($scope.user.phone_no, $scope.user.name);
        if(!$scope.user.phone_no) {
            console.log('empty Phone No.');
            return;
        }


        var save_and_go = function(usr) {
            db.insert_user(usr._id, usr.phoneNum, usr.uname)
            .then(function(result) {
                angular.extend(userData, usr);
                $state.go('topicList', {uid: usr._id, phone: usr.phoneNum});
            }, function(err) {console.log('Error:', err)});
        };


        Login.get({phone_no: $scope.user.phone_no})
        .$promise.then(
            //success
            function(usr) {
                if(usr) {
                    console.log(usr);
                    save_and_go(usr);
                }
                else {
                    console.log('something is horribly wrong...');
                }
            },
            //error
            function(err) {
                console.log('error:', err);
                if(!$scope.user.name) {
                    console.log('therefore name cannot be empty.');
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
        );
    };
}]);
