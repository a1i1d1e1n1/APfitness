/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('PasswordResetCtrl', ['$scope', 'UserService', 'toastr', '$location', 'usSpinnerService',
    function ($scope, UserService, toastr, $location, usSpinnerService) {

        $scope.passwordReset = function(email){
            usSpinnerService.spin('spinner-1');
            UserService.passwordReset(email).success(function(data) {
                usSpinnerService.stop('spinner-1');
                toastr.success(data);
                console.log(data);
                $location.path("/login");
            }).error(function(status, data) {
                usSpinnerService.stop('spinner-1');
                toastr.error(status.message);
                console.log(status);
                console.log(data);
            });
        }


    }
]);