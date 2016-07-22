angular.module('filters', ['filters.tel']);

angular.module('filters.tel', [])
    .filter('tel', function () {
        var phoneRegex = /(\d{6,11})/g;
        return (text => text.match(phoneRegex)
                ? text.replace(phoneRegex, '<a href="tel:$1">$1</a>')
                : text);
    });
