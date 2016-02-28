recommender.factory('Contacts',
['$q', '$resource', 'BACKEND', '$cordovaContacts', 'userData', 'db',
function ($q, $resource, BACKEND, $cordovaContacts, userData, db) {
    var get_device_contacts = function () {
        var deferred = $q.defer();

        if (!window.cordova) {
            deferred.resolve(['0892311229', '0871234567', '0862345678', '0892345678']);
            return deferred.promise;
        }

        $cordovaContacts.find({filter: '', multiple: true})
        .then(function (contacts) {
            var contacts_with_phone = contacts
                .filter(function (contact) {
                    return contact.phoneNumbers != null;
                })
                .map(function (contact) {
                    return {
                        phoneNumbers: contact.phoneNumbers.map(
                                          function (phoneNumber) {
                                              return phoneNumber.value;
                                          }),
                        name: contact.displayName
                    };
                });

            console.log('contacts_with_phone:', contacts_with_phone);

            var phones = contacts_with_phone.reduce(function (nums, contact) {
                contact.phoneNumbers.forEach(function (phone_num) {
                    if (phone_num)
                        nums.push(phone_num.replace(/\s+/g, ''));
                });
                return nums;
            }, []);
            console.log('phones:', phones);
            deferred.resolve(phones);
        });

        return deferred.promise;
    };


    var check_contacts = function (contactList) {
        console.log('attempting to check user contacts from server...');
        var contact_url = BACKEND.url + '/contacts/:user_id';
        return $resource(contact_url, {}, {get: {method: 'POST', isArray: true}})
            .get({user_id: userData._id}, contactList).$promise;
    };


    console.log('Contacts service is initialized successfuly.');
    //return check_contacts(['0871234567']);

    var async_contacts = $q.defer();

    var contacts_synced = get_device_contacts()
                            .then(check_contacts)
                            .then(db.save_contacts);


    db.get_contacts().then(function (contacts) {
        if (contacts.length !== 0) {
            console.log('local db contacts not empty.');
            console.log(contacts);
            async_contacts.resolve(contacts);
        } else {
            contacts_synced
            .then(db.get_contacts)
            .then(function (contacts) {
                console.log(contacts);
                async_contacts.resolve(contacts);
            });
        }
    });

    return async_contacts.promise;
}]);
