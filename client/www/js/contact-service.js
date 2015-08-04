recommender.factory('Contacts',
['$q', '$resource', 'BACKEND', '$cordovaContacts', 'userData', 'db',
function($q, $resource, BACKEND, $cordovaContacts, userData, db) {
    var get_device_contacts = function() {
        var deferred = $q.defer();

        $cordovaContacts.find({filter: '', multiple: true})
        .then(function(contacts) {
            console.log(contacts);
            var contacts_with_phone = contacts
                .filter(function(contact) {
                    return contact.phoneNumbers != null;
                })
                .map(function(contact) {
                    return {
                        phoneNumbers: contact.phoneNumbers.map(
                                          function(phoneNumber) {
                                              return phoneNumber.value;
                                          }),
                        name: contact.displayName
                    };
                });
            console.log('PHONE CONTACTS');
            console.log(contacts_with_phone);
            deferred.resolve(contacts_with_phone);
        });

        return deferred.promise;
    };

    var get_relevant_contacts = function(contactList) {
        var contact_url = BACKEND.url + '/contacts/:user_id';
        return $resource(contact_url).query({user_id: userData._id}).$promise;
    };

    console.log('Contacts service is initialized successfuly.');
    return get_relevant_contacts(['0872345678']);

    //return get_device_contacts().then(get_relevant_contacts);
}]);
