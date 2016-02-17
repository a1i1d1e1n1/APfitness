/* global angular */

angular.module('App').controller('OtherController', ['$scope',
    function($scope) {

        $scope.pageChangeHandler = function(num) {
            console.log('going to page ' + num);
        };
    }
]);








