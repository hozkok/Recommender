recommender.controller('topicCtrl', ['$scope', '$state', '$stateParams', '$resource', 'db', 'Topics',
function($scope, $state, $stateParams, $resource, db, Topics) {
    console.log('topicCtrl is initialized successfully.');
    console.log('topicCtrl uid param:', $stateParams.uid);
    Topics.query({user_id: $stateParams.uid}, function(topics) {
        console.log(topics);
        $scope.topics = topics;
    });
    
    // ================== TEST CODE (Remove) =====================
    var topicRequest = {
    	topic: {
    	    	what: 'Restaurant',
    	    	where: 'Galway',
    	    	desc: 'Seafood'
    		},
    	receivers: ['0861234567']
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
    // ================== TEST CODE (Remove) =====================

}]);
