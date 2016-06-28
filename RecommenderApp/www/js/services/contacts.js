angular.module('recommender.services')
.factory('contacts', function ($cordovaContacts, $q) {
    return {
        init() {
            if (!window.cordova) {
                return $q.resolve([
                    '1231231',
                    '2312312'
                ]);
            }
            return $cordovaContacts.find().then(contacts => {
                console.log(contacts);
                return contacts;
            });
        },
    };
});
