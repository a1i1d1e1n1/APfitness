/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', 'toastr',
    function($scope, $location, $window, UserService, AuthenticationService, toastr) {

        $scope.signIn = function signIn(email, password) {
            if (email != null && password != null) {

                UserService.signIn(email, password).success(function(data) {

                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.token;
                    toastr.success("Logged In");

                    if (data.admin == 1){
                        AuthenticationService.isAdmin = true;
                        $location.path("/adminHome");
                    }else{
                        AuthenticationService.isAdmin = false;
                        $location.path("/userHome");
                    }

                }).error(function(data, status) {
                    toastr.error(data.message);
                    console.log(status);
                    console.log(data);
                });
            }else{
                toastr.error("Please enter email and a password");
            }
        };


        $scope.register = function register(email, password, passwordConfirm) {

            if (AuthenticationService.isAuthenticated && $window.sessionStorage.token) {

                $location.path("/userHome");
                toastr.info("You are already logged in !!");

            }
            else {

                if (email != null && password != null && passwordConfirm != null) {
                    if (password.length > 5 ) {
                        if (password == passwordConfirm) {
                            UserService.register(email, password, passwordConfirm).success(function (data) {
                                toastr.success("Registered");
                                AuthenticationService.isAuthenticated = true;
                                $window.sessionStorage.token = data.token;
                                $location.path("/userHome");

                            }).error(function (data, status) {
                                toastr.error(data.message);
                                console.log(status);
                                console.log(data);

                            });
                        } else {
                            toastr.error("Passwords don't match");
                        }
                    } else {
                        toastr.error("Password too short. Must be 5 characters.");
                    }
                }else{
                    toastr.error("Please enter all fields");
                }
            }

        };

        $scope.user = function(){
            UserService.users().success(function(data) {
                $scope.data = data;
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });
        };

        $scope.navigate = function(page){
            $location.path(page);
        }
    }
]);