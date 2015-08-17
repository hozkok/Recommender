recommender.controller('shareCtrl', ['$scope', '$cordovaSocialSharing', '$ionicHistory', '$ionicPopup',
function($scope, socialSharing, $ionicHistory, $ionicPopup) {
    $scope.go_back = $ionicHistory.goBack;
    var share_msg = 'Recommender is a great app! Wanna try out?',
        share_link = 'http://recommenderdummyurl.com',
        share_img = null;

    //platform: Twitter, Facebook or WhatsApp
    var share_on = function(share_platform) {
        if(!window.cordova) {
            return function() {
                console.log('Not a mobile platform!');
            }
        }

        var share_cb = function() {
            console.log('Shared on', share_platform);
        };

        var share_error = function() {
            $ionicPopup.alert({
                title: 'Not Available!',
                template: '<p style="text-align: center;">Cannot access the ' + share_platform + ' app</p>'
            });
        };
        
        return function() {
            socialSharing['shareVia' + share_platform](share_msg, share_img, share_link)
            .then(share_cb, share_error);
        };
    };

    $scope.share_twitter = share_on('Twitter');
    $scope.share_whatsapp = share_on('WhatsApp');
    $scope.share_facebook = share_on('Facebook');
}]);
