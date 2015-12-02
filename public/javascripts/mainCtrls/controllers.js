/* global angular */

    var app = angular.module('App.controllers', []);


    app.controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
        function($scope, $location, $window, UserService, AuthenticationService) {

            $scope.signIn = function signIn(email, password) {
                if (email != null && password != null) {

                    UserService.signIn(email, password).success(function(data) {

                        AuthenticationService.isAuthenticated = true;
                        $window.sessionStorage.token = data.token;

                        if (data.admin == 1){
                            AuthenticationService.isAdmin = true;
                            $location.path("/adminHome");
                        }else{
                            AuthenticationService.isAdmin = false;
                            $location.path("/userHome");
                        }
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            };

            $scope.logOut = function logOut() {
                if (AuthenticationService.isAuthenticated) {

                    UserService.logOut().success(function(data) {
                        AuthenticationService.isAuthenticated = false;
                        delete $window.sessionStorage.token;
                        $location.path("/");
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
                else {
                    $location.path("#/");
                }
            };

            $scope.register = function register(email, password, passwordConfirm) {
                if (AuthenticationService.isAuthenticated) {
                    AuthenticationService.isAuthenticated = true;
                    $window.sessionStorage.token = data.token;
                    $location.path("/userHome");
                }
                else {
                    UserService.register(email, password, passwordConfirm).success(function(data) {
                        AuthenticationService.isAuthenticated = true;
                        $window.sessionStorage.token = data.token;
                        $location.path("/userHome");
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            };

            $scope.user = function(){
                UserService.users().success(function(data) {
                    $scope.data = data;
                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }

            $scope.navigate = function(page){
                $location.path(page);
            }
        }
    ]);

app.controller('HomePageCtrl', ['$rootScope', '$scope','$location', '$window', 'UserService', 'AuthenticationService',
    function($rootScope, $scope, $location, $window, UserService, AuthenticationService) {

        $scope.auth = AuthenticationService;


        $scope.logOut = function logOut() {
            if (AuthenticationService.isAuthenticated) {

                UserService.logOut().success(function(data) {
                    $rootScope.isAuthenticated = false;
                    AuthenticationService.isAdmin = false;
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    $location.path("/");
                }).error(function(status, data) {
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


app.controller('UserHomeCtrl', ['$scope', 'UserService',
    function($scope, UserService) {

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

app.controller('PasswordResetCtrl', ['$scope', 'UserService',
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