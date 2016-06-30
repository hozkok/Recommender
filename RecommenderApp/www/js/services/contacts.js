angular.module('recommender.services')
.factory('contacts', function ($cordovaContacts, $q, $localForage) {

    function getPhoneNums() {
        return $cordovaContacts.find({filter:'', multiple: true})
            .then(contacts => contacts
                .filter(contact => contact.phoneNumbers)
                .map(contact => contact.phoneNumbers)
                .reduce((allNums, nums) => allNums.concat(
                    nums.map(num => num.value.replace(/ /g, ''))), []));
    }

    function postPhoneNums(phoneNums) {
        return req.post('user/contacts', phoneNums)
            .then(httpRes => {
                console.log(httpRes.data);
            });
    }

    function fetchContacts(phoneNums) {
        return req.get('user/contacts')
            .then(httpRes => {
                console.log('user/contacts', httpRes.data);
                return $localForage.setItem('user/contacts', httpRes.data);
            });
    }

    return {
        init() {
            if (!window.cordova) {
                return $q.resolve([
                    '0891231231',
                    '0892312312'
                ]);
            }
            return getPhoneNums();
        },
    };
});
