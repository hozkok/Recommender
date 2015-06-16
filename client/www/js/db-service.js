recommender.factory('db', ['DB_CONF', '$cordovaSQLite', '$q', function(DB_CONF, $cordovaSQLite, $q) {
    var db = null;

    var populate_db = function(tx) {
        angular.forEach(DB_CONF.tables, function(table) {
            var attrs = [];
            angular.forEach(table.attrs, function(attr) {
                attrs.push(attr.name + ' ' + attr.type);
            });
            tx.executeSql('CREATE TABLE IF NOT EXISTS ' + table.name +
                '(' + attrs.join(',') + ')');
        });
    }

    var init_db = function() {
        db = typeof(cordova) !== 'undefined' ? 
            $cordovaSQLite.openDB({name: DB_CONF.name}) :
            window.openDatabase(DB_CONF.name, '1.0', 'Development db', 10000); 
        db.transaction(populate_db,
            //err
            function(err) {
                console.log('sql transaction error:', err);
            },//success
            function() {
                console.log('db is initialized successfully!');
            }
        );
    }

    function execute_sql(query, params) {
        params = (typeof(params) !== 'undefined') ? params : [];
        var async_result= $q.defer();

        db.transaction(function(tx) {
            tx.executeSql(query, params, function(tx, result) {
                async_result.resolve(result);
            }, function(tx, err) {
                async_result.reject(err);
            });
        });

        return async_result;
    }

    var get_user_data = function() {
        return execute_sql('SELECT * FROM user');
    };

    return {
        init: init_db
    };
}]);





 //recommender.controller('db', function($scope, $cordovaSQLite) {
 //    var db = $cordovaSQLite.openDB({name: 'recommend.db', dbType: 1});
 //    var query = 'INSERT INTO test (test_data) VALUES (?)';
 //    $cordovaSQLite.execute(db, query, ['testing...']).then(function(res) {
 //        console.log('insert id: ' + res.insertId);
 //    }, function(err) {
 //        console.log('Error: ' + err);
 //    });
 //});
