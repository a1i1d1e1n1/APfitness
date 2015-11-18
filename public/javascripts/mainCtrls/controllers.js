﻿/* global angular */

    var app = angular.module('App.controllers', []);


    app.controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService',
        function($scope, $location, $window, UserService, AuthenticationService) {

            $scope.signIn = function signIn(email, password) {
                if (email != null && password != null) {

                    UserService.signIn(email, password).success(function(data) {
                        AuthenticationService.isAuthenticated = true;
                        $window.sessionStorage.token = data.token;
                        $location.path("#/userHome");
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
                    $location.path("#/userHome");
                }
                else {
                    UserService.register(email, password, passwordConfirm).success(function(data) {
                        $location.path("/admin/login");
                    }).error(function(status, data) {
                        console.log(status);
                        console.log(data);
                    });
                }
            };
        }
    ]);



