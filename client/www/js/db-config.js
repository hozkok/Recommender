recommender.constant('DB_CONF', {
    name: 'recommend.db',
    tables: [
        {
            name: 'user',
            attrs: [
                {name: 'name', type: 'text'},
                {name: 'phone', type: 'text unique'}
            ]
        },
        {
            name: 'friend',
            attrs: [
                {name: 'name', type: 'text'},
                {name: 'phone', type: 'text unique'}
            ]
        },
        {
            name: 'message',
            attrs: [
                {name: 'text', type: 'text'},
                {name: 'sender', type: 'text'},
                {name: 'date', type: 'datetime'}
            ]
        }
    ]
});
