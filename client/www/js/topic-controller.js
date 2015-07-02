recommender.controller('topicListCtrl', ['$scope', '$state', '$stateParams', '$resource', 'db', 'Topics', 'Messaging', '$ionicPopover',
function($scope, $state, $stateParams, $resource, db, Topics, Messaging, $ionicPopover) {
    console.log('topicListCtrl is initialized successfully.');
    console.log('topicListCtrl uid param:', $stateParams.uid);


    Topics.query({user_id: $stateParams.uid}, function(topics) {
        console.log(topics);
        $scope.topics = topics;
    });

    $ionicPopover.fromTemplateUrl('templates/dropdown-popover.html', {scope: $scope})
        .then(function(popover) {
            $scope.open_popover = function(e) {
                popover.show(e);
            };
        });
    
    // ================== TEST CODE (Remove) =====================
    var topicRequest = {
    	topic: {
    	    	what: 'Restaurant',
    	    	where: 'Galway',
    	    	desc: 'Seafood'
    		},
    	receivers: ['0871234567']
    };

    $scope.push = function () {
    	console.log('topic post')
    	Topics.save(topicRequest).$promise.then(
            //success
            function(result) {
                if(result) {
                    console.log('topic posted');
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
    };
    Messaging.register().then(function() {
        $scope.push();
    });
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

recommender.controller('newTopicCtrl', ['$scope', 'userData', '$ionicHistory', '$ionicPopup', function($scope, userData, $ionicHistory, $ionicPopup) {
    $scope.go_back = $ionicHistory.goBack;
    console.log('newTopicCtrl is initialized successfully.');
    $scope.show_participants = function() {
        $ionicPopup.show({
            templateUrl: 'templates/participants.html',
            scope: $scope,
            buttons: [{
                text: 'OK',
                type: 'button-positive',
                onTap: function(e) {
                    console.log('participants are selected.');
                }
            }]
        });
    };
}]);
