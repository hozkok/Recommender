recommender.run(['$ionicPlatform', 'db', '$state', 'userData', function($ionicPlatform, db, $state, userData) {
    console.log('running...');
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        console.log('ionicPlatform ready');
        //if(window.cordova.plugins)
        //    console.log('i can see the cordova...');
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
        db.init();
        var user_data = db.get_user_data();
        user_data.then(function(result) {
            if(result.rows.length === 0) {
                console.log('user not found');
                $state.go('login');
            }
            else {
                console.log('result:', result);
                userData._id = result.rows.item(0).id;
                userData.phoneNum = result.rows.item(0).phone;
                userData.name = result.rows.item(0).name;

                $state.go('topicList', {
                    phone: result.rows.item(0).phone,
                    uid: result.rows.item(0).id}
                );
            }
        });
    });
}]);
