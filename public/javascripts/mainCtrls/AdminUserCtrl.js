/**
 * Created by Aiden Pert on 2/17/2016.
 * The controller for handling all admin functions.
 */

angular.module('App').controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', 'ProfileService', 'toastr', 'GAPI',
    function ($scope, $location, $window, UserService, AuthenticationService, ProfileService, toastr, GAPI) {

        //Signs in the user to the application while performing validation.
        $scope.signIn = function (email, password) {
            if (email != null && password != null) {

                //Calls user service to try and sign in user and handles responce.
                UserService.signIn(email, password).success(function(data) {

                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.token;
                    toastr.success("Logged In");
                    var admin = data.admin;
                    UserService.profile().success(function (data) {
                        $scope.profile = data;
                        $window.sessionStorage.first_name = data[0].first_name;
                        $window.sessionStorage.last_name = data[0].last_name;
                        $window.sessionStorage.user_id = data[0].userID;
                        if (admin == 1) {
                            AuthenticationService.isAdmin = true;
                            $location.path("/adminHome");
                        } else {
                            AuthenticationService.isAdmin = false;
                            GAPI.init();
                            $location.path("/userHome");
                        }
                        console.log(data);
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });



                }).error(function(data, status) {
                    toastr.error(data.message);
                    console.log(status);
                    console.log(data);
                });
            }else{
                toastr.error("Please enter email and a password");
            }
        };


        $scope.register = function (email, password, passwordConfirm) {

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

                                UserService.profile().success(function (data) {
                                    $scope.profile = data;
                                    ProfileService.first_name = data[0].first_name;
                                    ProfileService.last_name = data[0].last_name;
                                    ProfileService.userID = data[0].userID;
                                    $window.sessionStorage.first_name = data[0].first_name;
                                    $window.sessionStorage.last_name = data[0].last_name;
                                    $window.sessionStorage.user_id = data[0].userID;
                                    $location.path("/userHome");
                                    console.log(data);
                                }).error(function (status, data) {
                                    console.log(status);
                                    console.log(data);
                                });

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