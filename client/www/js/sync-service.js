recommender.factory('syncService', ['$q', '$rootScope', 'db', 'Topics', 'userData',
function ($q, $rootScope, db, Topics, userData) {
    console.log('sync-service initialized.');
    var sync_all = function () {
        return Topics.query({user_id: userData._id})
                     .$promise.then(db.sync_local_db);
    };
    return {
        sync_all: sync_all
    };
}]);
