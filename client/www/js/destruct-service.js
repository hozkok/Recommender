recommender.service('destructService', function ($http, $interval, db, BACKEND) {
    console.log('destructService');
    var defaults = {
        interval : 30 * 60 * 1000
    };
    return {
        init: function (opts) {
            $interval(function () {
                $http.get(BACKEND.url + '/datenow').then(function (httpRes) {
                    var now = httpRes.data.time;
                    var topic_list = db.get_topic_list().then(function (topics) {
                        console.log(topics.map(function (t) {
                            var topic_time = new Date(t.destruct_date).getTime();
                            return new Date(httpRes.data.time - topic_time);
                        }));
                    });
                    db.get_topic_list()
                    .then(function (topics) {
                        topics.forEach(function (topic) {
                            var topic_destruct_time = new Date(topic.destruct_date).getTime();
                            if (now > topic_destruct_time) {
                                db.delete_topic(topic.id);
                            }
                        });
                    });
                });
            }, defaults.interval/120);
        }
    };
});
