/**
 * Created by Aiden Pert on 2/17/2016.
 * The controller for workouts. This will display all the workouts in the system and allow users to to assign and rate
 * workouts.
 */

angular.module('App').controller('WorkoutCtrl', ['$rootScope', '$scope', 'WorkoutService', 'toastr', '$location','$uibModal',
    function($rootScope, $scope, WorkoutService, toastr,$location,$uibModal ) {
        //Pagnation set up
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $rootScope.hidemenu = false;
        $scope.max = 5;
        //Sets up all initial values and methods on page load.
        var init = function(){

            //Gets all the workouts and then gets all the exercises associated with them.
            WorkoutService.getAllWorkouts().success(function(data) {
                getAllExercies(data);
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });


        };

        var getAllExercies = function (workout) {
            WorkoutService.getAllWorkoutsExercise().success(function (data) {
                $scope.WorkoutsWithExercises = assignExercisesToWorkouts(workout, data);
            }).error(function (status, data) {
                console.log(status);
                console.log(data);
            });
        };

        //Assigns the exercises to the corresponding workout.
        var assignExercisesToWorkouts = function (workout, exercises) {
            for (var i = 0; i < workout.length; i++) {
                workout[i].exercises = [];
                for (var j = 0; j < exercises.length; j++) {
                    if (workout[i].workoutID == exercises[j].workoutID) {

                        workout[i].exercises.push(exercises[j]);
                    }
                }
            }
            return workout;
        };

        $scope.deleteWorkout = function (workout) {

        };

        //Opens the assign Modal while passing in the selected workout.
        $scope.openAssignWorkout = function (workout) {

            $scope.selectedWorkout = workout;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/Modals/workoutAssignModal.html',
                controller: 'AssignWorkoutModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.selectedWorkout;
                    }
                }
            });
        };

        $scope.openWorkout = function (workout) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/Modals/workoutModal.html',
                controller: 'WorkoutModalCtrl',
                resolve: {
                    items: function () {
                        return workout;
                    }
                }
            });

            modalInstance.result.then(function () {
                init();
            }, function () {
            });
        };

        //Gets search button to display correctly.
        var focusButtons = function() {
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.form-group').removeClass('focus');
            });
        };
        $("select").select2({dropdownCssClass: 'dropdown-inverse'});

        init();
        focusButtons();

    }
]);