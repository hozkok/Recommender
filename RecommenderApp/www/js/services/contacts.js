angular.module('recommender.services')
.factory('contacts', function ($cordovaContacts, $q, $localForage, utils, req) {

    function getPhoneNums() {
        if (!window.cordova) {
            return $q.resolve([
                '0891231231', // TestUser1
                '0892342342', // TestUser2
                '0893453453', // TestUser3
                '0894564564', // TestUser4
                '0895675675', // TestUser5
                '0891234567', // Browser
                '0892311229'
            ]);
        }
        return $cordovaContacts.find({filter:'', multiple: true})
            .then(contacts => contacts
                .filter(contact => contact.phoneNumbers)
                .map(contact => contact.phoneNumbers)
                .reduce((allNums, nums) => allNums.concat(
                    nums.filter(num => num.value)
                        .map(num => num.value.replace(/ /g, ''))), []));
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
            })
            .catch(err => (err.status === 404)
                ? $localForage.setItem('user/contacts', [])
                : $q.reject(err));
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
