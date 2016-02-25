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

    }
]);