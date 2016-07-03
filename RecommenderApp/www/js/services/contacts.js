angular.module('recommender.services')
.factory('contacts', function ($cordovaContacts, $q, $localForage, utils, req) {

    function getPhoneNums() {
        if (!window.cordova) {
            return $q.resolve([
                '0891231231',
                '0892342342',
            ]);
        }
        return $cordovaContacts.find({filter:'', multiple: true})
            .then(contacts => contacts
                .filter(contact => contact.phoneNumbers)
                .map(contact => contact.phoneNumbers)
                .reduce((allNums, nums) => allNums.concat(
                    nums.map(num => num.value.replace(/ /g, ''))), []));
    }

    function postPhoneNums(phoneNums) {
        return req.post('user/contacts', {phoneNums})
            .then(httpRes => {
            }).catch(err => console.error.bind(console, err));
    }

    function fetchContacts(phoneNums) {
        return req.get('user/contacts')
            .then(httpRes => {
                console.log('user/contacts [GET]', httpRes.data);
                return $localForage.setItem('user/contacts', httpRes.data);
            });
    }

    function refreshContacts() {
        return utils.sequence([
            getPhoneNums,
            postPhoneNums,
            fetchContacts,
        ]);
    }

    return {
        init() {
            return refreshContacts();
        },
        refreshContacts,
    };
});
