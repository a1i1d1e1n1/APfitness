/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('ProfileCtrl', ['$scope', 'UserService', 'toastr',
    function ($scope, UserService, toastr) {

        UserService.profile().success(function (data) {
            $scope.data = data;
            console.log(data);
        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });

        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['KG', 'lbs'];
        $scope.chartdata = [
            [70, 72, 74, 78, 88, 84, 82],
            [154.3, 158.7, 163.1, 171.9, 194.0, 185.1, 180.7]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };


    }
]);