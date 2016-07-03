// localForage stack data type

angular.module('stack', ['LocalForageModule'])
.factory('stack', function ($localForage) {

    return function (stackName) {

        var stack = $localForage.createInstance(stackName);

        return {
            push(item) {
                return stack.getItem('last')
                    .then(lastItem => {
                        if (!lastItem) {
                            return stack.setItem('last');
                        }
                    });
            },

            pop() {
            },

            clear() {
            },
        };

    };

});
