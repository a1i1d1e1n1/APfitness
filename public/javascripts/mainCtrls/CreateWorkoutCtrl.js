/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('CreateWorkoutCtrl', ['$rootScope', '$scope', 'ExerciseService', 'WorkoutService', 'toastr', '$location', '$uibModal',
    function ($rootScope, $scope, ExerciseService, WorkoutService, toastr, $location, $uibModal) {
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.exercises = [];
        $scope.searchType = 2;
        $scope.max = 5;

        $rootScope.hidemenu = true;

        //Initialises a blank workout with no exercises on page load.
        $scope.workout = {
            exercises:[]
        };

        $scope.increment = function (set) {
            set.reps += 1;
        };

        $scope.decrement = function (set) {
            if (set.reps > 0) {
                set.reps -= 1;
            }
        };

        $scope.openExercise = function (exercise) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/Modals/exerciseModal.html',
                controller: 'ExerciseModalCtrl',
                resolve: {
                    items: function () {
                        return exercise;
                    }
                }
            });
        };

        //Gets all exercises in database to be displayed on screen.
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
        };

        $scope.addSet = function (index){
            var set = {reps: 0, weight:0};
            $scope.workout.exercises[index].sets.push(set);
        };

        //Removes a set from the exercise
        $scope.removeSet = function (index,i){

            $scope.workout.exercises[index].sets.splice(i, 1);;
        };

        $scope.showCanvas = function () {
            $('.row-offcanvas').toggleClass('active')
        };

        //Swaps the exercises position in the workout when dropped on screen
        $scope.onDropComplete = function (index, obj, evt) {

            var otherObj = $scope.workout.exercises[index];
            var otherIndex = $scope.workout.exercises.indexOf(obj);

            $scope.workout.exercises[index] = obj;
            $scope.workout.exercises[otherIndex] = otherObj;

            console.log($scope.workout);
        };

        //Saves th workout if all conditions are met.
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