recommender.run(['$ionicPlatform', 'db', '$state', 'userData', 'Topics', '$http', function($ionicPlatform, db, $state, userData, Topics, $http) {
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

        // initialize local database...
        db.init();

        var user_data = db.get_user_data();
        user_data.then(function (result) {
            if(result.rows.length === 0) {
                console.log('user not found');
                $state.go('login');
            } else {
                console.log('user_data result:', result);
                userData._id = result.rows.item(0).id;
                userData.phoneNum = result.rows.item(0).phone;
                userData.name = result.rows.item(0).name;

                $state.go('topicList', {
                    phone: result.rows.item(0).phone,
                    uid: result.rows.item(0).id}
                );

                $http({
                    method: 'GET',
                    url: 'http://46.101.24.174:9000/topics/' + userData._id
                }).then(function (response) {
                    console.log('http get topics:', response.data);
                    db.sync_local_db(response.data)
                    .then(function (results) {
                        console.log('SYNC LOCAL DB RESULTS:', results);
                    }, function (err) {
                        console.log('SYNC LOCAL DB ERR:', err);
                    });
                });
                // Topics.get({user_id: userData._id}, function(topics, asd) {
                //     console.log('server topics req:', topics, asd);

                // });
                // .$promise.then(function (topics) {
                //     console.log('server topics req:', topics);
                // });
            }
        });

    });
}]);
