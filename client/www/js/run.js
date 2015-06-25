recommender.run(function($ionicPlatform, db, $state) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
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
                console.log('result:', result.rows[0]);
                $state.go('topics', {phone: result.rows[0].phone, uid: result.rows[0].id});
            }
        });
    });
});
