/**
 * Created by aiden on 27/04/2016.
 */

angular.module('App').controller('PublicWorkoutCtrl', ['$rootScope', '$scope', 'WorkoutService', 'toastr', '$routeParams', 'ExerciseService', '$uibModal',
    function ($rootScope, $scope, WorkoutService, toastr, $routeParams, ExerciseService, $uibModal) {

        $scope.gridOptions = {

            enableRowSelection: true,
            noUnselect: true,
            columnDefs: [
                {name: 'name', width: '50%'},
                {name: 'sets', width: '25%'},
                {name: 'reps', width: '25%'}
            ],
            appScopeProvider: {
                onClick: function (row) {
                    ExerciseService.getExercises(row.entity.exerciseID).success(function (data) {

                        openExercise(data[0]);
                    }).error(function (status, data) {
                        console.log(status);
                        console.log(data);
                    });

                }
            },
            rowTemplate: "<div ng-click=\"grid.appScope.onClick(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell ></div>"


        };
        var openExercise = function (exercise) {

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


        WorkoutService.getWorkoutsExercise($routeParams.id).success(function (data) {

            $scope.gridOptions.data = data;
            $scope.workout = data[0].workoutName;

        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });
    }
]);