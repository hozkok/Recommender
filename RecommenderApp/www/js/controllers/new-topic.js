angular.module('recommender.controllers')
.controller('newTopicCtrl', function (
        $scope,
        $ionicHistory,
        $q,
        req,
        utils,
        $localForage,
        ionicDatePicker,
        info,
        $ionicPopup,
        selectParticipants) {

    $scope.topic = {};
    $scope.topicNotValid = true;

    function getWhat(query, isInitializing) {
        if (!query) {
            return;
        }
        return $localForage.getItem('/where-list')
            .then(data => {
                return [query, ...data.counties.filter(
                    county => county.search(new RegExp(query, 'i')) !== -1
                )];
            });
    }
    $scope.getWhat = getWhat;

    function pickDestructDate() {
        var tomorrow = new Date(Date.now() + (24*60*60*1000));
        ionicDatePicker.openDatePicker({
            inputDate: tomorrow,
            from: tomorrow,
            callback: function (val) {
                $scope.topic.destructDate = val;
                console.log(Date(val));
            }
        });
    }
    $scope.pickDestructDate = pickDestructDate;

    function checkTopicData(topic) {
        function checkAttr(attr) {
            var isValid = (topic[attr] &&
                (!Array.isArray(topic[attr]) || topic[attr].length !== 0));
            return isValid
                ? $q.resolve({attr})
                : $q.reject(`${attr} field cannot be empty.`);
        }
        var attrs = ['what', 'where', 'description', 'participants'];
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
            console.log('new-topic result:', result);
            var savedTopic = result.data;
            return utils.instance('/topics')
                .setItem(savedTopic._id, savedTopic);
        })
        .then(result => {
            $ionicHistory.goBack();
        });
    }

    $scope.topic.participants = [];

    $scope.addParticipants = () => {
        console.log($scope.topic.participants);
        selectParticipants($scope.$new(), {
            preSelect: $scope.topic.participants,
            onTap: (event, selectedParticipants) => {
                console.log('SELECTED:', selectedParticipants);
                $scope.topic.participants = selectedParticipants;
                checkTopicData($scope.topic);
            }
        });
    };

    $scope.sendTopic = sendTopic;
});
