/**
 * Created by aiden on 02/03/2016.
 */

angular.module('App').controller('CommentCtrl', ['$scope', 'ExerciseService', 'toastr', 'items', '$uibModalInstance',
    function ($scope, ExerciseService, toastr, items, $uibModalInstance) {

        $scope.comment = {desc:"",exerciseID:null};

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.createComment = function (exercise) {

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
        };

        $scope.saveComment = function (comment){
            comment.exerciseID = items.exerciseID;
            ExerciseService.saveComment(comment).success(function(data) {
                toastr.success(data.message);
                $uibModalInstance.dismiss('cancel');
            }).error(function(status, data) {
                toastr.error(data.message);
            });
        }

    }
]);