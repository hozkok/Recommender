recommender.constant('DB_CONF', {
    name: 'recommend.db',
    tables: [
        {
            name: 'user',
            attrs: [
                {name: 'id', type: 'text unique'},
                {name: 'name', type: 'text'},
                {name: 'phone', type: 'text unique'},
                {name: 'push_token', type: 'text unique'}
            ]
        },
        {
            name: 'contacts',
            attrs: [
                {name: 'name', type: 'text'},
                {name: 'phone', type: 'text unique'}
            ]
        },
        {
            name: 'topics',
            attrs: [
                {name: 'id', type: 'text unique'},
                {name: 'owner_name', type: 'text'},
                {name: 'owner_phone', type: 'text'},
                {name: '`what`', type: 'text'},
                {name: '`where`', type: 'text'},
                {name: 'description', type: 'text'},
                {name: 'date', type: 'text'},
                {name: 'destruct_date', type: 'text'}
            ]
        },
        {
            name: 'messages',
            attrs: [
                {name: 'id', type: 'text unique'},
                {name: 'topic_id', type: 'text'},
                {name: 'text', type: 'text'},
                {name: 'sender_name', type: 'text'},
                {name: 'sender_phone', type: 'text'},
                {name: 'date', type: 'datetime'}
            ]
        },
        {
            name: 'participants',
            attrs: [
                {name: 'topic_id', type: 'text NOT NULL'},
                {name: 'uname', type: 'text NOT NULL'},
                {name: 'phone', type: 'text NOT NULL'}
            ],
            primary_keys: ['topic_id', 'phone']
        }
    ]
});
