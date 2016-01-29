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
        $scope.pageSize = 8;
        $scope.exercises = [];
        $scope.searchType = 2;

        var $slider = $("#slider");

        if ($slider.length > 0) {
            $slider.slider({
                min: 8,
                max: 24,
                value: $scope.pageSize,
                orientation: "horizontal",
                range: "min",
                slide: function( event, ui ) {
                    $scope.$apply(function() {
                        $scope.pageSize = ui.value;
                    });
                }

            }).addSliderSegments($slider.slider("option").max);
        }

        $scope.showVideo = function () {
            var v = '<iframe width="560" height="315" src="https://www.youtube.com/embed/fGt9o0XUl5g" frameborder="0" allowfullscreen></iframe>'
            var newHTML =	v;
            element.html(newHTML);
        };

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


app.controller('WorkoutCtrl', ['$rootScope', '$scope', 'WorkoutService', 'toastr',
    function($rootScope, $scope, WorkoutService, toastr) {
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.exercises = [];
        $scope.searchType = 2;



        WorkoutService.getAllWorkouts().success(function(data) {
            $scope.workouts = data;
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

app.controller('CreateWorkoutCtrl', ['$scope', 'ExerciseService','WorkoutService', 'toastr','$location',
    function($scope, ExerciseService, WorkoutService, toastr,$location) {
        $scope.currentPage = 1;
        $scope.pageSize = 8;
        $scope.exercises = [];
        $scope.searchType = 2;
        $scope.workout = {
            exercises:[]
        };

        ExerciseService.getAllExercises().success(function(data) {
            $scope.exercises = data;
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });

        $scope.addExercise = function (exercise){
            exercise.sets = [];
            $scope.workout.exercises.push(exercise);

        };

        $scope.removeExercise = function (i){
            $scope.workout.exercises.splice(i, 1);;
        }

        $scope.addSet = function (index){
            var set = {reps: 0, weight:0};
            $scope.workout.exercises[index].sets.push(set);
        };

        $scope.removeSet = function (index,i){

            $scope.workout.exercises[index].sets.splice(i, 1);;
        };

        $scope.onDropComplete = function (index, obj, evt) {
            var otherObj = $scope.workout.exercises[index];
            var otherIndex = $scope.workout.exercises.indexOf(obj);
            $scope.workout.exercises[index] = obj;
            $scope.workout.exercises[otherIndex] = otherObj;
            console.log($scope.workout);
        };

        $scope.saveWorkout = function (workout) {
            //Makes sure workout has at least one exercise
            if(workout.exercises.length > 0){
                var validWorkout = false;

                validWorkout = checkName(workout.name);
                validWorkout = checkSets(workout,validWorkout);

                if(validWorkout){
                    WorkoutService.saveWorkout(workout).success(function(data){
                        toastr.success("Workout Saved. Available in workouts page.");
                        $location.path("/userHome");
                    });
                }

            }else{
                toastr.error("Please add at least one exercise !!");
            }
            console.log($scope.workout);
        };

        //Checks to see if the workout has a name.
        var checkName = function(workoutName) {
            if(!workoutName){

                toastr.error("Please make sure you enter a Workout Name");

            }else{
                return(true);
            }
        };

        //Checks to see if the exercise's have at least one set
        var checkSets = function(workout,valid){
            if(valid){
                for(var i = 0; i < workout.exercises.length; i++){
                    if(workout.exercises[i].sets.length == 0) {

                        toastr.error("Please make sure all your exercises have sets added !!");
                        return(false);
                    }
                }
                return(true);
            }

        };

        //Coode added to add flat-ui component styling.
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