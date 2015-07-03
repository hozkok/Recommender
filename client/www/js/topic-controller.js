recommender.controller('topicListCtrl', ['$scope', '$state', 'userData', '$resource', 'db', 'Topics', 'Messaging', '$ionicPopover',
function($scope, $state, userData, $resource, db, Topics, Messaging, $ionicPopover) {
    console.log('topicListCtrl is initialized successfully.');
    console.log('topicListCtrl uid param:', userData._id);


    Topics.query({user_id: userData._id}, function(topics) {
        console.log(topics);
        $scope.topics = topics;
    });

    $ionicPopover.fromTemplateUrl('templates/dropdown-popover.html', {scope: $scope})
    .then(function(popover) {
        $scope.open_popover = function(e) {
            popover.show(e);
        };

        $scope.close_popover = function() {
            popover.hide();
        };
    });
    
    // ================== TEST CODE (Remove) =====================
    // var topicRequest = {
    //     owner: userData._id,
    // 	what: 'Restaurant',
    // 	where: 'Galway',
    // 	description: 'Seafood',
    // 	participants: ['0871234567']
    // };

    // $scope.push = function () {
    // 	console.log('topic post')
    // 	Topics.save(topicRequest).$promise.then(
    //         //success
    //         function(result) {
    //             if(result) {
    //                 console.log('topic posted');
    //             }
    //             else {
    //                 console.log('something is wrong...');
    //             }
    //         },
    //         //error
    //         function(err) {
    //             console.log('error', err);
    //         }
    //     );
    // };
    // Messaging.register().then(function() {
    //     $scope.push();
    // });
    // ================== TEST CODE (Remove) =====================

}]);


recommender.controller('topicCtrl', ['$scope', '$state', '$stateParams', '$resource', '$ionicHistory', 'db', 'Topic',
function($scope, $state, $stateParams, $resource, $ionicHistory, db, Topic) {
    console.log('topicCtrl is initialized successfully.');
    console.log('topic id:', $stateParams.topic_id);
    Topic.get({topic_id: $stateParams.topic_id}, function(topic) {
        console.log('topic ->', topic);
        $scope.topic = topic;
    });
    $scope.go_back = $ionicHistory.goBack;
}]);

recommender.controller('newTopicCtrl', ['$scope', 'userData', '$ionicHistory', '$ionicPopup', 'Topics', '$state',
function($scope, userData, $ionicHistory, $ionicPopup, Topics, $state) {
    var participants = [];
    $scope.topic = {};
    $scope.go_back = $ionicHistory.goBack;
    console.log('newTopicCtrl is initialized successfully.');


    //TODO: assign this to real user contacts later...
    $scope.contacts = [
        {name: 'TestUser', phoneNum: '0871234567'},
        {name: 'TestUser2', phoneNum: '0872345678'}
    ];


    $scope.show_participants = function() {
        $ionicPopup.show({
            title: '<h2>Contacts</h2>',
            templateUrl: 'templates/participants.html',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    console.log('participants are selected.');
                    participants = $scope.contacts.filter(function(c) {return c.checked});
                }
            }]
        });
    };

    $scope.save_topic = function() {
        if(participants.length === 0) {
            console.log('You must select at least one participant.');
            $ionicPopup.alert({
                title: 'No Way!',
                template: '<p style="text-align: center;">You must select at least one participant.</p>' 
            });
            return;
        }
        if(!$scope.topic.what) {
            console.log('What input cannot be empty.');
            $ionicPopup.alert({
                title: 'No Way!',
                template: '<p style="text-align: center;">What input cannot be empty.</p>' 
            });
            return;
        }

        var topic = {
            owner: userData._id,
            what: $scope.topic.what,
            where: $scope.topic.where,
            description: $scope.topic.description,
            participants: participants.map(function(p) {return p.phoneNum;})
        };

        Topics.save(topic)
        .$promise.then(
            //success
            function() {
                console.log('Topic is successfully sent to the server.');
                $state.go('topicList');
            },
            //error
            function() {
                console.log('An error occured during sending new topic.');
            }
        );
    };
}]);
