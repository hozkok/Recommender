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
            name: 'friends',
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
                {name: '`where`', type: 'text'},
                {name: '`when`', type: 'text'},
                {name: 'description', type: 'text'}
            ]
        },
        {
            name: 'messages',
            attrs: [
                {name: 'text', type: 'text'},
                {name: 'sender', type: 'text'},
                {name: 'date', type: 'datetime'}
            ]
        }
    ]
});
