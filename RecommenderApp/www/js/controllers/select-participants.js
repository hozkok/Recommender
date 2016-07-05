angular.module('recommender.controllers')
.factory('selectParticipants', function ($localForage, $ionicPopup) {
    return function addParticipants(scope, opts) {
        $localForage.getItem('user/contacts')
            .then(contacts => {
                console.log(contacts);
                contacts.forEach(contact => {
                    contact.checked = scope.topic.participants.find(
                        c => c._id === contact._id
                    ) !== undefined;
                    if (opts.excludes &&
                        opts.excludes.find(exclude => contact._id === exclude)) {
                        contact.alreadyAdded = true;
                        contact.checked = true;
                    }
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
                                scope.topic.participants = scope.contacts
                                    .filter(c => c.checked && !c.alreadyAdded);
                                console.log('selected participants:',
                                            scope.topic.participants);
                                if (opts.onTap) {
                                    opts.onTap(event);
                                }
                            }
                        },
                    ]
                });
            });
    };
});
