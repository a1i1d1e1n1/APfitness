/**
 * Created by aiden on 03/03/2016.
 */

angular.module('App').controller('WorkoutModalCtrl', ['$scope', 'WorkoutService', 'toastr', 'items', '$uibModal', '$uibModalInstance', 'ProfileService',
    function ($scope, WorkoutService, toastr, items, $uibModal, $uibModalInstance, ProfileService) {

        $scope.workout = items;

        $scope.userID = ProfileService.userID;

        $scope.close = function () {
            $uibModalInstance.close();
        };

        $scope.gridOptions = {
            enableFiltering: false,

            columnDefs: [
                {name: 'name', width: '70%'},
                {name: 'sets', width: '30%'},
            ]
        };

        $scope.gridOptions.data = items.exercises;

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

        $scope.deleteComment = function (comment) {
            WorkoutService.deleteComment(comment).success(function (data) {
                getAllComments();
                toastr.success("Your comment has been deleted !");
            }).error(function (status, data) {
                toastr.error(data);
            });
        };

        getAllComments();
    }
]);
