/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('HomePageCtrl', ['$rootScope', '$scope','$location', '$window', 'UserService', 'AuthenticationService', 'toastr',
    function($rootScope, $scope, $location, $window, UserService, AuthenticationService, toastr) {

        $scope.auth = AuthenticationService;

        $scope.createWorkout = function(){
            $location.path("/createworkout");
        };


        UserService.profile().success(function (data) {
            $scope.user = data;
            console.log(data);
        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });


        $scope.logOut = function logOut() {
            if (AuthenticationService.isAuthenticated) {

                UserService.logOut().success(function(data) {
                    $rootScope.isAuthenticated = false;
                    AuthenticationService.isAdmin = false;
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    toastr.success("Logged Out");
                    $location.path("/");
                }).error(function(status, data) {
                    toastr.error("Error Logging Out:" + data);
                    $location.path("/userHome");
                    console.log(status);
                    console.log(data);
                });
            }
            else {
                $location.path("#/");
            }
        };

    }
]);