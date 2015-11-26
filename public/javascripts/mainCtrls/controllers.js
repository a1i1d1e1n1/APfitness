/* global angular */

    var app = angular.module('App.controllers', []);


    app.controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
        function($scope, $location, $window, UserService, AuthenticationService) {

            $scope.signIn = function signIn(email, password) {
                if (email != null && password != null) {

                    UserService.signIn(email, password).success(function(data) {
                        AuthenticationService.isAuthenticated = true;
                        $window.sessionStorage.token = data.token;
                        $location.path("/userHome");
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
                    $location.path("/userHome");
                }
                else {
                    UserService.register(email, password, passwordConfirm).success(function(data) {
                        $location.path("/userHome");
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            };

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
                    AuthenticationService.isAuthenticated = false;
                    delete $window.sessionStorage.token;
                    $location.path("/");
                }).error(function(status, data) {
                    $location.path("/");
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


app.controller('UserHomeCtrl', ['$scope', '$location',
    function($scope, $location) {



    }
]);
