recommender.controller('topicListCtrl',
['$scope', '$state', 'userData', '$resource', 'db', 'Topics', 'PushService', '$ionicPopover', 'syncService',
function($scope, $state, userData, $resource, db, Topics, PushService, $ionicPopover, syncService) {
    console.log('topicListCtrl is initialized successfully.');
    console.log('topicListCtrl uid param:', userData._id);
    
    $scope.$on('push:topic', function(event, push_topic) {
        // console.log('TopicListCtrl received broadcast push topic:', push_topic);
        $scope.topics.push({
            id: push_topic._id,
            owner_name: push_topic.owner_name,
            what: push_topic.what,
            where: push_topic.where,
            description: push_topic.description,
            date: push_topic.date,
            destruct_date: push_topic.destruct_date
        });
    });

    db.get_topic_list().then(function (topics) {
        console.log('All Topics:', topics);
        $scope.topics = topics;
    }, function(err) {
        console.log('get_topic_list ERR:', err);
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

    $scope.sync = function () {
        syncService.sync_all()
        .then(db.get_topic_list)
        .then(function (topics) {
            $scope.topics = topics;
        })
        .finally($scope.$broadcast.bind($scope, 'scroll.refreshComplete'));
    };
    
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
    PushService.register().then(function(push_token) {
        console.log('register token', push_token);
    });
    $scope.$on('notification:topic', function(event, push_data) {
        console.log('push msg event:', event);
        console.log('new topic push listened:', push_data);
    });
    // ================== TEST CODE (Remove) =====================

}]);


recommender.controller('topicCtrl', 
['$scope', '$state', '$stateParams', '$resource', '$ionicHistory', 'db', 'Topic', 'userData', 'Message', '$ionicLoading', 'Contacts', '$ionicPopup', '$q', 'syncService',
function($scope, $state, $stateParams, $resource, $ionicHistory, db, Topic, userData, Message, $ionicLoading, Contacts, $ionicPopup, $q, syncService) {
    console.log('topicCtrl is initialized successfully.');
    console.log('topic id:', $stateParams.topic_id);
    var topic_id = $stateParams.topic_id;
    var footer = document.body.querySelector('.message-footer');
    $scope.message = '';
    $scope.topic = {};
    $scope.topic.messages = [];

    $scope.$on('push:message', function(event, push_msg) {
        if(push_msg.topic_id === topic_id) {
            push_msg.sender_name = push_msg.sender.uname;
            $scope.topic.messages.push(push_msg);
        }
    });

    db.get_topic(topic_id).then(function (topic) {
        console.log('topic query result:', topic);
        $scope.topic = topic;
        return $q.when(topic);
    })
    .then(function (topic) {
        return $q.all([
            db.get_messages(topic_id).then(function (messages) {
                console.log('Topic Messages:', messages);
                $scope.topic.messages = messages;
                return $q.when(messages);
            }),

            db.get_participants(topic_id).then(function (participants) {
                console.log('Topic participants:', participants);
                $scope.topic.participants = participants;
                return $q.when(participants);
            })
        ]);
    })
    .then(function () {
        $scope.topic.participants.forEach(function (p) {
            p.checked = true;
            p.isStatic = true;
        });
        if (!$scope.topic.participants.some(function (p) {return p.phone === $scope.topic.owner_phone;})) {
            $scope.topic.participants.push({
                uname: $scope.topic.owner_name + ' (owner)',
                phone: $scope.topic.owner_phone,
                checked: true,
                isStatic: true
            });
        }
    });

    $scope.$on('push:message', function(push_message) {
        if(push_message.topic_id === topic_id)
            $scope.topic.messages.push(push_message);
    });

    //Topic.get({topic_id: $stateParams.topic_id}, function(topic) {
    //    console.log('topic ->', topic);
    //    $scope.topic = topic;
    //});

    $scope.go_back = $ionicHistory.goBack;


    $scope.add_participant = function () {
        console.log('topic:', $scope.topic);
        Contacts.then(function (contacts) {
            console.log('contacts', contacts);
            return $q.when($scope.topic.participants.concat(
                contacts.filter(function(c) {
                    // only get the contacts who are not already in participant list.
                    return !$scope.topic.participants.some(
                        function (p) {
                            return c.phone === p.phone;
                        }
                    );
                }).map(function (c) {
                    return {
                        uname: c.name,
                        phone: c.phone
                    };
                })
            ));
        })
        .then(function (participants_mixed_with_contacts) {
            console.log('mixed', participants_mixed_with_contacts);
            $scope.topic.participants = participants_mixed_with_contacts;
            $ionicPopup.show({
                title: '<h4>Add New Participants</h4>',
                template: [
                    '<ul class="list">',
                        '<li class="item item-checkbox" ng-repeat="p in topic.participants">',
                            '<label class="checkbox">',
                                '<input type="checkbox" ng-model="p.checked" ng-disabled="p.isStatic"/>',
                            '</label>',
                            '{{p.uname}}',
                        '</li>',
                    '</ul>'
                ].join(''),
                scope: $scope,
                buttons: [{
                    text: 'Add participants',
                    type: 'button-positive',
                    onTap: function(e) {
                        var new_participant_checker = function (p) {
                            return p.checked && !p.isStatic;
                        }
                        var new_participants = $scope.topic.participants.filter(new_participant_checker);
                        if (!new_participants.length) {
                            console.log('no new participant selected.');
                            return;
                        }
                        Topic.update({topic_id: $scope.topic.id}, new_participants)
                        .$promise.then(function (res) {
                            console.log('add participant response:', res);
                            new_participants.forEach(function (p) {
                                p.isStatic = true;
                            });
                            syncService.sync_all();
                        }, function (err) {
                            console.log('new participant err:', err);
                        });
                    }
                }]
            });
        });
    };

    $scope.$on('elastic:height-changed', function(event, msgHeight) {
        if(!msgHeight) return;

        if(!footer) {
            console.log('error: couldn\'t get footer.');
            return;
        }
        footer.style.height = ((msgHeight > 34) ? msgHeight : 34) + 10 + 'px';
    });

    $scope.send_message = function() {
        $ionicLoading.show({
            template: '<p>Sending message...</p><ion-spinner></ion-spinner>'
        });
        var msg = {
            text: $scope.message,
            sender_id: userData._id,
            topic_id: $stateParams.topic_id
        };
        Message.save(msg)
        .$promise.then(
            //success
            function(msg) {
                console.log('message is successfully sent to the server.', msg);
                db.save_message(msg).then(function() {
                    console.log('new message is successfully saved into db.');
                }, function(err) {
                    console.log('new message cannot be saved into db, ERR:', err);
                });
                msg.sender_name = userData.name;
                $scope.topic.messages.push(msg);
                $scope.message = '';
            },
            //error
            function(err) {
                console.log('error: message could not be sent ->', err);
            }
        ).finally($ionicLoading.hide.bind($ionicLoading));
    };
}]);

recommender.controller('newTopicCtrl',
['$scope', 'userData', '$ionicHistory', '$ionicPopup', 'Topics', '$state', 'LocationService', 'Contacts', 'db', '$ionicLoading',
function($scope, userData, $ionicHistory, $ionicPopup, Topics, $state, LocationService, Contacts, db, $ionicLoading) {
    var participants = [];
    $scope.topic = {};
    $scope.go_back = $ionicHistory.goBack;
    console.log('newTopicCtrl is initialized successfully.');


    //TODO: assign this to real user contacts later...
    //$scope.contacts = [
    //    {uname: 'TestUser', phoneNum: '0871234567'},
    //    {uname: 'TestUser2', phoneNum: '0872345678'}
    //];
    Contacts.then(function(contacts) {
        console.log(contacts);
        $scope.contacts = contacts;
    });

    // set destruct timer to 7 days by default
    $scope.topic.destruct_date = 7;
    

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
                    if (!$scope.contacts) return;

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
        $ionicLoading.show({
            template: '<p>Creating topic...</p><ion-spinner></ion-spinner>'
        });
        console.log('userData:', userData);
        var topic = {
            owner: userData._id,
            owner_name: userData.name,
            owner_phone: userData.phoneNum,
            what: $scope.topic.what,
            where: $scope.topic.where.title,
            description: $scope.topic.description,
            participants: participants.map(function(p) {return p.phone;}),
            destruct_date: $scope.topic.destruct_date
        };

        Topics.save(topic)
        .$promise.then(
            //success
            function(received_topic) {
                console.log('Topic is successfully sent to the server:', received_topic);
                db.save_topic(received_topic).then(function() {
                    console.log('new topic is successfully saved into db.');
                }, function(err) {
                    console.log('new topic couldnt be saved into db ERR:', err);
                });
                $state.go('topicList');
            },
            //error
            function() {
                console.log('An error occured during sending new topic.');
            }
        ).finally($ionicLoading.hide.bind($ionicLoading));
    };


    $scope.locations = '';
    LocationService.find_locations('').then(function(locs) {
        $scope.locations = locs.map(function(loc) {
            return {name: loc};
        });
    });

    $scope.search = function() {
        LocationService.find_locations($scope.topic.what)
        .then(
            function(locs) {
                console.log(locs);
                $scope.locs = locs;
            }
        );
    };
}]);
