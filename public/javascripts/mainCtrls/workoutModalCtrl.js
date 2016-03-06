/**
 * Created by aiden on 03/03/2016.
 */

angular.module('App').controller('WorkoutModalCtrl', ['$scope', 'WorkoutService', 'toastr', 'items', '$uibModal', '$uibModalInstance',
    function ($scope, WorkoutService, toastr, items, $uibModal, $uibModalInstance) {

        $scope.workout = items;

        $scope.close = function () {
            $uibModalInstance.close();
        };

        var getAllComments = function () {
            WorkoutService.getAllComments(items.workoutID).success(function (data) {
                $scope.comments = data;
                console.log(data);
            }).error(function (status, data) {
                toastr.error(data);
            });
        };

        $scope.openComment = function (workout) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/Modals/commentModal.html',
                controller: 'CommentCtrl',
                resolve: {
                    items: function () {
                        return workout;
                    }
                }
            });

            modalInstance.result.then(function () {
                getAllComments();
            }, function () {
            });
        };

        getAllComments();
    }
]);
