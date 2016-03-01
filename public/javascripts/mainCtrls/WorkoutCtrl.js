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

        //Sets up all initial values and methods on page load.
        var init = function(){

            //Gets all the workouts and then gets all the exercises associated with them.
            WorkoutService.getAllWorkouts().success(function(data) {
                $scope.workouts = data;
                WorkoutService.getAllWorkoutsExercise().success(function(data) {
                    $scope.workouts_exercises = data;
                    $scope.WorkoutsWithExercises = assignExercisesToWorkouts();

                }).error(function(status, data) {
                    console.log(status);
                    console.log(data);
                });
            }).error(function(status, data) {
                console.log(status);
                console.log(data);
            });


        };

        //Assigns the exercises to the corresponding workout.
        var assignExercisesToWorkouts = function(){
            for(var i = 0 ; i < $scope.workouts.length;i++){
                $scope.workouts[i].exercises = [];
                for(var j = 0 ; j < $scope.workouts_exercises.length;j++){
                    if($scope.workouts[i].workoutID == $scope.workouts_exercises[j].workoutID){

                        $scope.workouts[i].exercises.push($scope.workouts_exercises[j]);
                    }
                }
            }
            return $scope.workouts;
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