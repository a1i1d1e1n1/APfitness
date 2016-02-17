/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('PasswordResetCtrl', ['$scope', 'UserService',
    function($scope, UserService) {

        $scope.passwordReset = function(email){
            UserService.passwordReset(email).success(function(data) {
                $scope.data = data;
                console.log(data);
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        }


    }
]);