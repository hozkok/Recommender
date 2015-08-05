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
            var phones = contacts_with_phone.reduce(function(nums, contact) {
                var curr_nums = contact.phoneNumbers;
                for(var i = 0; i < curr_nums.length; i++)
                    nums.push(curr_nums[0].replace(/\s+/g, ''));
                return nums;
            }, []);
            console.log(phones);
            deferred.resolve(phones);
            //deferred.resolve(contacts_with_phone);
        });

        return deferred.promise;
    };


    var check_contacts = function(contactList) {
        var contact_url = BACKEND.url + '/contacts/:user_id';
        return $resource(contact_url, {}, {get: {method: 'POST', isArray: true}})
            .get({user_id: userData._id}, contactList).$promise;
    };


    console.log('Contacts service is initialized successfuly.');
    //return get_relevant_contacts(['0871234567']);

    return get_device_contacts().then(check_contacts);
}]);
