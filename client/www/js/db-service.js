recommender.factory('db', ['DB_CONF', '$cordovaSQLite', '$q', function(DB_CONF, $cordovaSQLite, $q) {
    var async_db = $q.defer();
    var db = null;

    var populate_db = function(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS user');
        //tx.executeSql('DROP TABLE IF EXISTS topics');
        //tx.executeSql('DROP TABLE IF EXISTS contacts');
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
        var async_result = $q.defer();

        var transaction_completed = function() {
            var queries_completed = 0,
                len = data_arr.length;

            return function() {
                queries_completed++;
                console.log('completed ' + queries_completed + ': ' + query);
                return queries_completed === len;
            };
        }();

        var generate_callback = function() {
            var resolved = {results: [], errors: []};
            var result_type = {'success': 'results', 'error': 'errors'};

            return function(cb_type) {
                console.log('generating callback:', cb_type);
                if(cb_type !== 'success' && cb_type !== 'error') {
                    console.log('ERROR: bad callback type!');
                    return;
                }

                return function(tx, result) {
                    console.log(cb_type + ' result: ' + result);
                    resolved[result_type[cb_type]].push(result);
                    if(transaction_completed()) {
                        async_result.resolve(resolved);
                        console.log('all transactions completed.');
                    }
                };
            };
        }();

        var exec_queries = function(db) {
            db.transaction(function(tx) {
                console.log('data_arr len:', data_arr.length);
                console.log(query);
                var success_cb = generate_callback('success'),
                    error_cb = generate_callback('error');
                for(var i = 0; i < data_arr.length; i++) {
                    console.log('data' + i + ': ' + data_arr[i]);
                    tx.executeSql(query, data_arr[i],
                                  success_cb,
                                  error_cb);
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

    var save_messages = function(messages) {
        var query = 'INSERT OR IGNORE INTO messages (id, topic_id, sender, text, date) VALUES(?, ?, ?, ?, ?)';
        return exec_multiple_sql(query, messages);
    };

    var save_contacts = function(contacts) {
        var query = 'INSERT OR IGNORE INTO contacts (name, phone) VALUES(?, ?)';

        contacts = contacts.map(function(contact) {
            return [contact.uname, contact.phoneNum];
        });

        return exec_multiple_sql(query, contacts);
    };

    var get_contacts = function() {
        var deferred = $q.defer();

        execute_sql('SELECT * FROM contacts')
        .then(function(results) {
            var result_arr = [];

            for(var i = 0; i < results.rows.length; i++) {
                result_arr.push(results.rows.item(i));
            }

            deferred.resolve(result_arr);
        },
        deferred.reject);

        return deferred.promise;
    };


    return {
        init: init_db,
        get_user_data: get_user_data,
        insert_user: insert_user,
        get_messages: get_messages,
        save_contacts: save_contacts,
        get_contacts: get_contacts,
        save_messages: save_messages
    };
}]);
