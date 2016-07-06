angular.module('ion-accordion', ['accordion-item'])
.directive('ionAccordion', function () {
    var template = `<ion-list class="ion-accordion" ng-transclude></ion-list>`;

    return {
        restrict: 'E',
        transclude: true,
        //replace: true,
        scope: {
            oneAtATime: '@',
        },
        controller: function ($scope) {
            var accordionItems = [];
            this.open = (item) => {
                if ($scope.oneAtATime) {
                    accordionItems.forEach(_item => {
                        _item.isOpened = false;
                    });
                }
                item.isOpened = true;
            };

            this.add = item => {
                accordionItems.push(item);
            };
        },
        template,
    };
});

angular.module('accordion-item', [])
.directive('accordionItem', function () {
    var template = `
<ion-item class="item-stable" ng-click="toggle()" ng-class="{active: isOpened}">
    <i class="icon" ng-class="isOpened ? 'ion-minus' : 'ion-plus'"></i>
    &nbsp; {{titleText}}
</ion-item>
<ion-item class="item-accordion" ng-show="isOpened" ng-transclude></ion-item>`;

    return {
        require: '^ionAccordion',
        transclude: true,
        scope: {
            titleText: '@',
        },
        link: function (scope, elem, attrs, ctrl) {
            scope.isOpened = false;
            ctrl.add(scope);
            scope.toggle = () => {
                if (!scope.isOpened) {
                    ctrl.open(scope);
                } else {
                    scope.isOpened = false;
                }
            };
        },
        template,
    };
});
