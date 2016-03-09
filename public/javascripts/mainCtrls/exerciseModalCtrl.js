/**
 * Created by aiden on 26/02/2016.
 */

angular.module('App').controller('ExerciseModalCtrl', ['$scope', 'ExerciseService', 'toastr', 'items', '$uibModal', '$uibModalInstance', 'ProfileService',
    function ($scope, ExerciseService, toastr, items, $uibModal, $uibModalInstance, ProfileService) {

        $scope.exercise = items;

        $scope.videoUrl = "https://www.youtube.com/embed/" + items.exerciseURL;

        $scope.userID = ProfileService.userID;

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
        var getAllComments = function () {
            ExerciseService.getAllComments(items.exerciseID).success(function (data) {
                $scope.comments = data;
                console.log(data);
            }).error(function (status, data) {
                toastr.error(data);
            });
        };

        $scope.openComment = function (exercise) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/Modals/commentModal.html',
                controller: 'CommentCtrl',
                resolve: {
                    items: function () {
                        return exercise;
                    }
                }
            });
            modalInstance.result.then(function () {
                getAllComments();
            }, function () {
            });
        };

        $scope.deleteComment = function (comment) {
            ExerciseService.deleteComment(comment).success(function (data) {
                getAllComments();
                toastr.success("Your comment has been deleted !");
            }).error(function (status, data) {
                toastr.error(data);
            });
        };

        getAllComments();
    }
]);