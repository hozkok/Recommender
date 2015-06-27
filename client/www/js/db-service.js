recommender.factory('db', ['DB_CONF', '$cordovaSQLite', '$q', function(DB_CONF, $cordovaSQLite, $q) {
    var async_db = $q.defer();
    var db = null;

    var populate_db = function(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS user');
        //tx.executeSql('DROP TABLE IF EXISTS topics');
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
        var db_prep = typeof(cordova) !== 'undefined' ? 
            $cordovaSQLite.openDB({name: DB_CONF.name}) :
            window.openDatabase(DB_CONF.name, '1.0', 'Development db', 10*1024*1024); 
        db_prep.transaction(populate_db,
            //err
            function(err) {
                console.log('sql transaction error:', err);
                async_db.reason(err);
            },//success
            function() {
                console.log('db is initialized successfully!');
                async_db.resolve(db_prep);
                db = db_prep;
            }
        );
    }

    function execute_sql(query, params) {
        params = (typeof(params) !== 'undefined') ? params : [];
        var async_result= $q.defer();

        var exec_query = function(db) {
            db.transaction(function(tx) {
                console.log('executing SQL statement:', query, params);
                tx.executeSql(query, params, function(tx, result) {
                    async_result.resolve(result);
                }, function(tx, err) {
                    async_result.reject(err);
                });
            });
        };

        if(db === null) {
            //TODO: try to use promise chain here...
            async_db.promise.then(exec_query);
        } else {
            exec_query(db);
        }

        return async_result.promise;
    }

    var get_user_data = function() {
        return execute_sql('SELECT * FROM user');
    };

    var insert_user = function(id, phone, name) {
        name = typeof name !== 'undefined' ? name : '';
        return execute_sql('INSERT INTO user VALUES(?, ?, ?)', [id, name, phone]);
    };

    var get_messages = function(sender) {
        var query = 'SELECT * FROM message WHERE sender=?';
        return execute_sql(query, [sender]);
    }

    return {
        init: init_db,
        get_user_data: get_user_data,
        insert_user: insert_user
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
