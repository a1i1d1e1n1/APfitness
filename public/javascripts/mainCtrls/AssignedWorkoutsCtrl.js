/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('AssignedWorkoutCtrl', ['$rootScope', '$scope', 'WorkoutService', 'toastr',
    function ($rootScope, $scope, WorkoutService, toastr) {
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.workouts = [];
        $scope.searchType = 2;
        $rootScope.hidemenu = false;

        WorkoutService.getAssignWorkout().success(function (data) {
            $scope.workouts = data;
            console.log(data);
        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });


    }
]);