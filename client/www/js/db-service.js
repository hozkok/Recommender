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
    };

    var init_db = function() {
        var db_prep = typeof(cordova) !== 'undefined' ? 
            $cordovaSQLite.openDB(DB_CONF.name) :
            window.openDatabase(DB_CONF.name, '1.0', 'Development db', 10*1024*1024); 
        db_prep.transaction(populate_db,
            //err
            function(err) {
                console.log('sql transaction error:', err);
                async_db.reason(err);
            },//success
            function() {
                console.log('db is initialized successfully!');
                db = db_prep;
                async_db.resolve(db_prep);
            }
        );
    };

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
    };


    function exec_multiple_sql(query, data_arr) {
        var len = data_arr.length;
        var async_result = $q.defer();

        var transaction_completed = function() {
            var queries_completed = 0;
            return function() {
                queries_completed++;
                return queries_completed === len;
            };
        }();

        var generate_callback = function(cb_type) {
            var resolved = {results: [], errors: []};

            switch(cb_type) {
                case 'error':
                    return function(tx, err) {
                        resolved.errors.push(err);
                        if(transaction_completed())
                            async_result.resolve(resolved);

                    }
                case 'success':
                    return function(tx, result) {
                        resolved.results.push(result);
                        if(transaction_completed())
                            async_result.resolve(resolved);
                    }
                default:
                    throw 'ERROR: bad callback type!';
            }
        };

        var exec_queries = function(db) {
            db.transaction(function(tx) {
                for(var i=0; i < len; i++) {
                    tx.executeSql(query, data_arr[i],
                        generate_callback('success'),
                        generate_callback('error'));
                }
            });
        };
        
        async_db.promise.then(
            //success
            exec_queries,
            //error
            function(err) {
                console.log('cannot reach to db:', err);
            }
        );

        return async_result.promise;
    };


    var get_user_data = function() {
        return execute_sql('SELECT * FROM user');
    };

    var insert_user = function(id, phone, name) {
        name = typeof name !== 'undefined' ? name : '';
        return execute_sql('INSERT INTO user (id, name, phone) VALUES(?, ?, ?)', [id, name, phone]);
    };

    var update_token = function(token) {
        return execute_sql('UPDATE user SET push_token = ?' [token]);
    };

    var get_messages = function(topic_id) {
        var query = 'SELECT * FROM messages WHERE topic_id=?';
        return execute_sql(query, [topic_id]);
    };

    var save_messages = function(topic_id, messages) {
        var query = 'INSERT INTO messages (topic_id, sender, text, date) VALUES(?, ?, ?, ?)';
    };

    var save_contacts = function(contacts) {
        var query = 'INSERT INTO contacts (name, phone) VALUES(?, ?)';
        exec_multiple_sql(query, contacts);
    };

    return {
        init: init_db,
        get_user_data: get_user_data,
        insert_user: insert_user,
        get_messages: get_messages
    };
}]);
