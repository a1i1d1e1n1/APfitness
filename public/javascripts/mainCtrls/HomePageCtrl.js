/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('HomePageCtrl', ['$rootScope', '$scope', '$location', '$window', 'UserService', 'AuthenticationService', 'toastr', 'ProfileService',
    function ($rootScope, $scope, $location, $window, UserService, AuthenticationService, toastr, ProfileService) {

        $scope.auth = AuthenticationService;


        $scope.user = ProfileService;


        $scope.logout = function () {
            if (AuthenticationService.isAuthenticated) {

                UserService.logOut().success(function(data) {

                    delete $window.sessionStorage.token;
                    delete $window.sessionStorage.first_name;
                    delete $window.sessionStorage.last_name;
                    $rootScope.isAuthenticated = false;
                    AuthenticationService.isAuthenticated = false;
                    AuthenticationService.isAdmin = false;
                    ProfileService.first_name = "";
                    ProfileService.last_name = "";
                    toastr.success("Logged Out Successfully");
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