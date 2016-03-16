/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('ProfileCtrl', ['$rootScope', '$scope', 'UserService', 'WorkoutService', 'toastr', '$uibModal',
    function ($rootScope, $scope, UserService, WorkoutService, toastr, $uibModal) {

        $rootScope.hidemenu = false;

        $scope.gridOptions = {
            enableFiltering: false,

            columnDefs: [
                {name: 'workoutName', width: '40%'},
                {name: 'start_date', width: '30%'},
                {name: 'end_date', width: '30%'}
            ]
        };



        UserService.profile().success(function (data) {
            $scope.data = data;
            console.log(data);
        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });

        WorkoutService.getMostRecent().success(function (data) {
            $scope.recent_workouts = data;
            $scope.gridOptions.data = data;
            console.log(data);
        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });

        $scope.profileEdit = function (profile) {
            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/Modals/profileEditModal.html',
                controller: 'ProfileModalCtrl',
                resolve: {
                    items: function () {
                        return profile;
                    }
                }
            });

            modalInstance.result.then(function () {
                UserService.profile().success(function (data) {
                    $scope.data = data;
                    console.log(data);
                }).error(function (status, data) {
                    console.log(status);
                    console.log(data);
                });
            }, function () {
            });
        };

        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['KG', 'lbs'];
        $scope.chartdata = [
            [70, 72, 74, 78, 88, 84, 82],
            [154.3, 158.7, 163.1, 171.9, 194.0, 185.1, 180.7]
        ];
        $scope.onClick = function (points, evt) {
            console.log(points, evt);
        };


    }
]);