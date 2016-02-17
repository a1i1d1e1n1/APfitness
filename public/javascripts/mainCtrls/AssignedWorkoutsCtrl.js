/**
 * Created by nm on 2/17/2016.
 */

var app = angular.module('App.controllers', []);

app.controller('AssignedWorkoutCtrl', ['$scope', 'WorkoutService', 'toastr',
    function ($scope, WorkoutService, toastr) {
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.workouts = [];
        $scope.searchType = 2;

        WorkoutService.getAssignWorkout().success(function (data) {
            $scope.workouts = data;
            console.log(data);
        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });


    }
]);