recommender.factory('Contacts',
['$q', '$resource', 'BACKEND', '$cordovaContacts', 'userData', 'db',
function($q, $resource, BACKEND, $cordovaContacts, userData, db) {
    var get_device_contacts = function() {
        var deferred = $q.defer();

        if(!window.cordova) {
            deferred.resolve(['0892311229']);
            return deferred.promise;
        }

        $cordovaContacts.find({filter: '', multiple: true})
        .then(function(contacts) {
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

            var phones = contacts_with_phone.reduce(function(nums, contact) {
                var curr_nums = contact.phoneNumbers;
                for(var i = 0; i < curr_nums.length; i++)
                    nums.push(curr_nums[0].replace(/\s+/g, ''));
                return nums;
            }, []);
            deferred.resolve(phones);
            //deferred.resolve(contacts_with_phone);
        });

        return deferred.promise;
    };


    var check_contacts = function(contactList) {
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


    db.get_contacts().then(function(contacts) {
        if(contacts.length !== 0) {
            console.log('local db contacts not empty.');
            console.log(contacts);
            async_contacts.resolve(contacts);
        }
        else {
            contacts_synced.then(function() {
                db.get_contacts().then(function(contacts) {
                    console.log(contacts);
                    async_contacts.resolve(contacts);
                });
            });
        }
    });

    return async_contacts.promise;
}]);
