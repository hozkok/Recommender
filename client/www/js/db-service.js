recommender.factory('db', ['DB_CONF', '$cordovaSQLite', '$q', function(DB_CONF, $cordovaSQLite, $q) {
    var async_db = $q.defer();
    var db = null;

    var populate_db = function(tx) {
        //tx.executeSql('DROP TABLE IF EXISTS user');
        //tx.executeSql('DROP TABLE IF EXISTS topics');
        //tx.executeSql('DROP TABLE IF EXISTS contacts');
        //tx.executeSql('DROP TABLE IF EXISTS messages');
        //tx.executeSql('DROP TABLE IF EXISTS participants');
        angular.forEach(DB_CONF.tables, function(table) {
            var attrs = [];
            angular.forEach(table.attrs, function(attr) {
                attrs.push(attr.name + ' ' + attr.type);
            });

            var pk_expression = (typeof(table.primary_keys) === 'undefined') ? '':
                ', PRIMARY KEY(' + table.primary_keys.join(',') + ')';
            
            // create table statement
            var sql_statement = 'CREATE TABLE IF NOT EXISTS ' + 
                                table.name + '(' + attrs.join(',') + pk_expression + ')';

            console.log(sql_statement);
            tx.executeSql(sql_statement);
        });
    };

    var init_db = function () {
        var db_prep = (window.cordova)
            ? $cordovaSQLite.openDB(DB_CONF.name) 
            : window.openDatabase(DB_CONF.name,
                                  '1.0',
                                  'Development db',
                                  10*1024*1024); 
        db_prep.transaction(populate_db,
            //err
            function (err) {
                console.log('sql transaction error:', err);
                async_db.reason(err);
            },//success
            function () {
                console.log('db is initialized successfully!');
                db = db_prep;
                async_db.resolve(db_prep);
            }
        );
    };

    function result_to_obj_arr(results) {
        var obj_arr = [];
        console.log('result_to_obj_arr results', results);
        for(var i = 0; i < results.rows.length; i++) {
            obj_arr.push(results.rows.item(i));
        }
        return obj_arr;
    };

    function execute_sql(query, params) {
        console.log('inside execute_sql func, params:', params);
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
        var deferred = $q.defer();

        execute_sql(query, [topic_id]).then(function(messages) {
            deferred.resolve(result_to_obj_arr(messages));
        }, deferred.reject);

        return deferred.promise;
    };

    var save_messages = function(messages) {
        var query = 'INSERT OR IGNORE INTO messages (id, topic_id, sender, text, date) VALUES(?, ?, ?, ?, ?)';
        return exec_multiple_sql(query, messages);
    };

    var save_contacts = function(contacts) {
        if (!contacts) return $q.reject(new Error('Contacts empty.'));
        var query = 'INSERT OR IGNORE INTO contacts (name, phone) VALUES(?, ?)';

        console.log('save_contacts:', contacts);
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

    var save_participants = function(topic_id, participants) {
        var query = 'INSERT OR IGNORE INTO participants (topic_id, uname, phone) VALUES(?, ?, ?)';
        var sql_params = participants.map(function(participant) {
            return [topic_id, participant.uname, participant.phoneNum];
        });
        return exec_multiple_sql(query, sql_params);
    };

    var get_participants = function(topic_id) {
        var query = 'SELECT * FROM participants WHERE topic_id = ?';
        return execute_sql(query, [topic_id])
        .then(function (results) {
            return $q.when(result_to_obj_arr(results));
        });
    };

    var save_topic = function (topic) {
        var query = 'INSERT OR REPLACE INTO topics (id, owner_name, owner_phone, `what`, `where`, description, date, destruct_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?)';
        console.log('save_topic params:',topic);

        // topic.participants = { uname, phoneNum }
        save_participants(topic._id, topic.participants)
        .then(function(results) {
            console.log('topic_id:', topic._id, 'save_participants is executed. results:', results);
        });

        return execute_sql(query, [
                topic._id,
                topic.owner_name,
                topic.owner_phone,
                topic.what,
                topic.where,
                topic.description,
                topic.date,
                topic.destruct_date]);
    };

    var save_message = function(msg) {
        var query = 'INSERT OR IGNORE INTO messages (id, topic_id, text, sender_name, sender_phone, date) VALUES(?, ?, ?, ?, ?, ?)';
        return execute_sql(query, [
                msg._id,
                msg.topic_id,
                msg.text,
                msg.sender.uname,
                msg.sender.phoneNum,
                msg.date
        ]);
    };

    var get_topic = function(topic_id) {
        var query = 'SELECT * FROM topics WHERE id = ?';
        var deferred = $q.defer();

        execute_sql(query, [topic_id])
        .then(function(result) {
            console.log('get_topic result:', result);
            deferred.resolve((result.rows.length === 0) ? null : result.rows.item(0));
        });

        return deferred.promise;
    };

    var get_topic_list = function() {
        var deferred = $q.defer();
        var query = 'SELECT * FROM topics';
        execute_sql(query).then(function(results) {
            var obj_arr = result_to_obj_arr(results);
            deferred.resolve(obj_arr);
        }, deferred.reject);
        return deferred.promise;
    };

    var delete_topic = function (topic_id) {
        var queries = [
            'DELETE FROM topics WHERE id = ?',
            'DELETE FROM messages WHERE topic_id = ?',
            'DELETE FROM participants WHERE topic_id = ?'
        ];
        return $q.all(queries.map(function (q) {
            return execute_sql(q, [topic_id]);
        }));
    };

    function sync_local_db(topics) {
        function sync_topic(topic) {
            console.log('sync topic:', topic);
            return execute_sql('INSERT OR REPLACE INTO topics (id, owner_name, owner_phone, `what`, `where`, description, date, destruct_date) VALUES(?, ?, ?, ?, ?, ?, ?, ?)', [topic._id,
                                  topic.owner.uname,
                                  topic.owner.phoneNum,
                                  topic.what,
                                  topic.where,
                                  topic.description,
                                  topic.date,
                                  topic.destruct_date]);
        }

        function sync_participant(participant) {
            console.log('participantttt', participant);
            return execute_sql('INSERT OR REPLACE INTO participants (topic_id, uname, phone) VALUES (?, ?, ?)', [
                participant.topic_id,
                participant.uname,
                participant.phoneNum
            ]);
        }
        
        var db_operations = topics.reduce(function (acc_arr, topic) {
            return acc_arr.concat(
                [sync_topic(topic)],
                topic.participants.map(
                    function (participant) {
                        console.log('participant:', participant);
                        return sync_participant({
                            topic_id: topic._id,
                            uname: participant.uname,
                            phoneNum: participant.phoneNum
                        });
                    }
                ),
                topic.messages.map(
                    function (message) {
                        message.topic_id = topic._id;
                        return save_message(message);
                    }
                )
            );
        }, []);
        return $q.all(db_operations);
    }

    return {
        init: init_db,
        get_user_data: get_user_data,
        insert_user: insert_user,
        get_messages: get_messages,
        save_contacts: save_contacts,
        get_contacts: get_contacts,
        save_messages: save_messages,
        save_topic: save_topic,
        save_message: save_message,
        get_topic: get_topic,
        get_topic_list: get_topic_list,
        get_participants: get_participants,
        sync_local_db: sync_local_db,
        delete_topic: delete_topic
    };
}]);
