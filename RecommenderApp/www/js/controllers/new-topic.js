angular.module('recommender.controllers')
.controller('newTopicCtrl', function ($scope, $ionicHistory, $q, req, utils, $localForage, ionicDatePicker, info, $ionicPopup) {
    $scope.topic = {};
    $scope.topicNotValid = true;

    function getWhat(query, isInitializing) {
        console.log('query:', query);
        return $localForage.getItem('/where-list')
            .then(data => {
                return [query, ...data.counties.filter(
                    county => county.search(new RegExp(query, 'i')) !== -1
                )];
            });
    }
    $scope.getWhat = getWhat;

    function pickDestructDate() {
        ionicDatePicker.openDatePicker({
            from: Date.now(),
            callback: function (val) {
                $scope.destructDate = val;
                console.log(Date(val));
            }
        });
    }
    $scope.pickDestructDate = pickDestructDate;

    function checkTopicData(topic) {
        function checkAttr(attr) {
            return topic[attr]
                ? $q.resolve({attr})
                : $q.reject(`${attr} field cannot be empty.`);
        }

        var attrs = ['what', 'where', 'description'];
        return $q.all(attrs.map(attr => checkAttr(attr)))
            .then(results => {
                console.log('checkTopicData results:', results);
                $scope.topicNotValid = false;
                return topic;
            })
            .catch(err => {
                $scope.topicNotValid = true;
                return $q.reject(err);
            });
    }
    $scope.checkTopicData = checkTopicData;

    function postTopic(topic) {
        return req.post('topics/', topic)
            .catch(err => {
                return $q.reject(err.statusText);
            });
    }

    function sendTopic(topic) {
        console.log('topic:', topic);
        var asyncTasks = utils.sequence([
            checkTopicData(topic),
            postTopic,
        ]);
        return info.loading(asyncTasks, {
                successMessage: 'topic is sent.',
                errorMessage: undefined,
        })
        .then(result => {
            $ionicHistory.goBack();
        });
    }

    $scope.topic.participants = [];
    function addParticipants() {
        $localForage.getItem('user/contacts')
            .then(contacts => {
                console.log(contacts);
                var scope = $scope.$new();
                contacts.forEach(contact => {
                    contact.checked = $scope.topic.participants.find(
                        c => c._id === contact._id
                    ) !== undefined;
                });
                scope.contacts = contacts;
                $ionicPopup.show({
                    title: 'Add Participants',
                    templateUrl: 'templates/select-participants.html',
                    scope,
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-positive',
                            onTap: event => {
                                console.log('ehircik', scope.contacts);
                                $scope.topic.participants = scope.contacts
                                    .filter(c => c.checked);
                            }
                        },
                    ]
                });
            });
    }
    $scope.addParticipants = addParticipants;

    $scope.sendTopic = sendTopic;
});
