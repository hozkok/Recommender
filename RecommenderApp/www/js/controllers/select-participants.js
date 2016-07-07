angular.module('recommender.controllers')
.factory('selectParticipants', function ($localForage, $ionicPopup, share) {
    return function addParticipants(scope, opts) {
        $localForage.getItem('user/contacts')
            .then(contacts => {
                console.log(contacts);
                scope.contacts = contacts.map(contact => {
                    var c = Object.assign({}, contact);
                    if (opts.excludes &&
                        opts.excludes.find(exclude => contact._id === exclude)) {
                        contact.alreadyAdded = true;
                        contact.checked = true;
                        c.alreadyAdded = true;
                        c.checked = true;
                    }
                    if (opts.preSelect &&
                        opts.preSelect.find(_c => _c._id === contact._id)) {
                        c.checked = true;
                    }
                    return c;
                });
                scope.share = () => {
                    share({
                        message: 'Recommender is a great app.',
                        link: 'web.recommender.com'
                    });
                };
                $ionicPopup.show({
                    title: '<strong>Add Participants</strong>',
                    templateUrl: 'templates/select-participants.html',
                    scope,
                    buttons: [
                        {
                            text: 'Ok',
                            type: 'button-positive',
                            onTap: event => {
                                var selectedParticipants = scope.contacts
                                    .filter(c => c.checked && !c.alreadyAdded);

                                console.log('selected participants:',
                                            selectedParticipants);
                                if (opts.onTap) {
                                    opts.onTap(event, selectedParticipants);
                                }
                            }
                        },
                        {
                            text: 'Cancel',
                            type: 'button-stable',
                            onTap: event => {
                                var selectedParticipants = [];
                                if (opts.onTap) {
                                    opts.onTap(event, selectedParticipants);
                                }
                            },
                        },
                    ]
                });
            });
    };
});
