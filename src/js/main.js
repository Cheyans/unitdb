var app = angular.module('app', ['ngRoute', 'angular-underscore']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            controller: 'HomeCtrl',
            templateUrl: 'home.html'
        })
        .otherwise({
            templateUrl: '404.html'
        });
}]);

app.factory('data', ['$http', function($http) {
    return $http.get('/data/index.json');
}]);

app.filter('tech', function() {
    return function(text) {
        var dict = {
            RULEUTL_Basic: 'T1'
        };

        return dict[text] || 'T?';
    };
})
app.filter('name', function() {
    return function(item) {
        return (item.name ? item.name + ': ' : '') + item.tech + ' ' + item.description;
    }
});

app.directive('ngCard', [function() {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: 'thumb.html',
        scope: {
            item: '=ngContent'
        }
    }
}]);

app.controller('HomeCtrl', ['$scope', 'data', function($scope, data) {

    $scope.factions = [];
    $scope.kinds = [];
    $scope.tech = [];

    var toggleArray = function(arr, el) {
        var idx = arr.indexOf(el);
        if (idx >= 0) {
            arr = arr.splice(idx, 1);
        } else {
            arr.push(el);
        }
    },
    isInArray = function(arr, el) {
        return arr.indexOf(el) >= 0;
    };

    $scope.toggleFaction = function(f) {
        toggleArray($scope.factions, f);
    };
    $scope.factionSelected = function(f) {
        return isInArray($scope.factions, f);
    }
    $scope.toggleKind = function(k) {
        toggleArray($scope.kinds, k);
    };
    $scope.kindSelected = function (k) {
        return isInArray($scope.kinds, k);
    };
    $scope.toggleTech = function(t) {
        toggleArray($scope.tech, t);
    };
    $scope.techSelected = function(t) {
        return isInArray($scope.tech, t);
    };

    $scope.strain = function(e) {
        return ($scope.factions.length == 0 || isInArray($scope.factions, e.faction))
                && ($scope.kinds.length == 0 || isInArray($scope.kinds, e.classification))
                && ($scope.tech.length == 0 || isInArray($scope.tech, e.tech));
    };

    data.success(function(d) {
        $scope.index = d;
    });

}]);
