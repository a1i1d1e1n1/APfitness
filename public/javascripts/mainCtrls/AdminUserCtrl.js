/**
 * Created by Aiden Pert on 2/17/2016.
 * The controller for handling all admin functions.
 */

angular.module('App').controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', 'ProfileService', 'toastr', 'GoogleService',
    function ($scope, $location, $window, UserService, AuthenticationService, ProfileService, toastr, GoogleService) {



        //Signs in the user to the application while performing validation.
        $scope.signIn = function (email, password) {
            if (email != null && password != null) {

                //Calls user service to try and sign in user and handles responce.
                UserService.signIn(email, password).success(function(data) {


                    $window.sessionStorage.token = data.token;
                    toastr.success("Logged In");
                    var user = data;
                    UserService.profile().success(function (data) {
                        $scope.profile = data;
                        if (user.admin == 1) {
                            AuthenticationService.isAdmin = true;
                            $location.path("/adminHome");
                        } else {
                            AuthenticationService.isAdmin = false;
                            if (user.google == 1) {
                                GoogleService.auth().success(function (data) {
                                    AuthenticationService.isAuthenticated = true;
                                    $window.open(data);
                                    $location.path("/userHome");
                                });
                            } else {
                                $location.path("/userHome");
                            }


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


        $scope.register = function (email, password, passwordConfirm, google) {

            if (AuthenticationService.isAuthenticated && $window.sessionStorage.token) {

                $location.path("/userHome");
                toastr.info("You are already logged in !!");

            }
            else {

                if (email != null && password != null && passwordConfirm != null) {
                    if (password.length > 4) {
                        if (password == passwordConfirm) {
                            if (google) {
                                google = true;
                            } else {
                                google = false;
                            }
                            UserService.register(email, password, passwordConfirm, google).success(function (data) {
                                toastr.success("Registered");
                                AuthenticationService.isAuthenticated = true;
                                $window.sessionStorage.token = data.token;

                                UserService.profile().success(function (data) {
                                    AuthenticationService.isAuthenticated = true;
                                    if (google) {
                                        GoogleService.auth().success(function (data) {
                                            AuthenticationService.isAuthenticated = true;
                                            $window.open(data);
                                            $location.path("/userHome");
                                        });
                                    } else {
                                        $location.path("/userHome");
                                    }

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