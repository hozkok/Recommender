recommender.constant('DB_CONF', {
    name: 'recommend.db',
    tables: [
        {
            name: 'user',
            attrs: [
                {name: 'name', type: 'text'},
                {name: 'phone', type: 'text'}
            ]
        },
        {
            name: 'friend',
            attrs: [
                {name: 'name', type: 'text'},
                {name: 'phone', type: 'text'}
            ]
        }
    ]
});
