/**
 * Created by aiden on 18/02/2016.
 */

angular.module('App').controller('OtherController', ['$scope',
    function ($scope) {

        $scope.pageChangeHandler = function (num) {
            console.log('going to page ' + num);
        };
    }
]);