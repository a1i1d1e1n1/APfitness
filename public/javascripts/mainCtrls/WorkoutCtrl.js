/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('WorkoutCtrl', ['$rootScope', '$scope', 'WorkoutService', 'toastr', '$location','$uibModal',
    function($rootScope, $scope, WorkoutService, toastr,$location,$uibModal ) {
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.exercises = [];
        $scope.searchType = 2;
        $scope.gridOptions = {};
        $scope.selectedWorkout = 1;

        var init = function(){
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

        $scope.pageChangeHandler = function(num) {
            console.log('meals page changed to ' + num);
        };

        $scope.searchType = function(type) {
            console.log(type);
        };


        $scope.openAssignWorkout = function (workout) {

            $scope.selectedWorkout = workout;

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/exerciseModal.html',
                controller: 'ExerciseModalCtrl',
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        };

        $scope.closeAssignWorkout = function () {
            $scope.selectedWorkout = null;
            $('#modalAssignWorkout').modal('hide');
        };

        $scope.assignWorkout = function (date, time) {
            WorkoutService.assignWorkout($scope.selectedWorkout, date, time).success(function (data) {
                console.log(data);
                toastr.success("Workout has been assigned to your calender");
                $location.path("/assigned");

            }).error(function (status, data) {
                console.log(status);
                console.log(data);
            });

        };

        var datepickerInit = function () {
            var datepickerSelector = $('#datepicker-01');
            datepickerSelector.datepicker({
                showOtherMonths: true,
                selectOtherMonths: true,
                minDate: 0,
                dateFormat: 'd MM, yy',
                yearRange: '-1:+1'
            }).prev('.input-group-btn').on('click', function (e) {
                e && e.preventDefault();
                datepickerSelector.focus();
            });
            $.extend($.datepicker, {
                _checkOffset: function (inst, offset, isFixed) {
                    return offset;
                }
            });

            // Now let's align datepicker with the prepend button
            datepickerSelector.datepicker('widget').css({'margin-left': -datepickerSelector.prev('.input-group-btn').find('.btn').outerWidth() + 3});

            $('#timepicker-01').timepicker({
                className: 'timepicker-primary',
                timeFormat: 'h:i A'
            });
        };

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
        datepickerInit();
    }
]);