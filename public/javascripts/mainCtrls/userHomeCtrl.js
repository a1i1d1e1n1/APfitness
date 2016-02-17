/**
 * Created by nm on 2/17/2016.
 */
angular.module('App').controller('UserHomeCtrl', ['$scope', 'UserService','toastr',
    function($scope, UserService, toastr) {

        $scope.user = function(){
            UserService.users().success(function(data) {
                $scope.data = data;
                console.log(data);
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        }


    }
]);