/* global angular */

    var app = angular.module('App.controllers', []);


    app.controller('AdminUserCtrl', ['$scope', '$location', '$window', 'UserService', 'AuthenticationService', 'toastr',
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
            }

            $scope.navigate = function(page){
                $location.path(page);
            }
        }
    ]);

app.controller('HomePageCtrl', ['$rootScope', '$scope','$location', '$window', 'UserService', 'AuthenticationService', 'toastr',
    function($rootScope, $scope, $location, $window, UserService, AuthenticationService, toastr) {

        $scope.auth = AuthenticationService;


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

app.controller('ExerciseCtrl', ['$rootScope', '$scope', 'ExerciseService', 'toastr',
    function($rootScope, $scope, ExerciseService, toastr) {
        $scope.currentPage = 1;
        $scope.pageSize = 15;
        $scope.exercises = [];
        $scope.searchType = 2;



        ExerciseService.getAllExercises().success(function(data) {
            $scope.exercises = data;
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });


        $scope.pageChangeHandler = function(num) {
            console.log('meals page changed to ' + num);
        };

        $scope.searchType = function(type) {
            console.log(type);
        };

        var focusButtons = function() {
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.form-group').removeClass('focus');
            });
        };
        $("select").select2({dropdownCssClass: 'dropdown-inverse'});

        focusButtons();
    }
]);

app.controller('OtherController', ['$scope',
    function($scope) {

        $scope.pageChangeHandler = function(num) {
            console.log('going to page ' + num);
        };
    }
]);

app.controller('UserHomeCtrl', ['$scope', 'UserService','toastr',
    function($scope, UserService, toastr) {


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

app.controller('CreateWorkoutCtrl', ['$scope', 'ExerciseService','toastr',
    function($scope, ExerciseService, toastr) {
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.exercises = [];
        $scope.searchType = 2;
        $scope.workout = [];

        ExerciseService.getAllExercises().success(function(data) {
            $scope.exercises = data;
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });

        $scope.addExercise = function (exercise){
            exercise.sets = [];
            $scope.workout.push(exercise);

        };

        $scope.addSet = function (index){
            var set = {reps: 5, weight:50};
            $scope.workout[index].sets.push(set);
        };

        var focusButtons = function() {
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.form-group').removeClass('focus');
            });
        };
        $("select").select2({dropdownCssClass: 'dropdown-inverse'});

        focusButtons();
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