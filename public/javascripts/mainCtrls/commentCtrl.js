/**
 * Created by aiden on 02/03/2016.
 */

angular.module('App').controller('CommentCtrl', ['$scope', 'ExerciseService', 'WorkoutService', 'toastr', 'items', '$uibModalInstance',
    function ($scope, ExerciseService, WorkoutService, toastr, items, $uibModalInstance) {

        $scope.comment = {desc: "", rate: 0, exerciseID: null};
        $scope.max = 10;
        $scope.isReadonly = false;

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
            if (comment.desc == null || comment.desc == "") {
                toastr.error("Please enter comment");
            } else {
                if (items.exerciseID != null) {
                    comment.exerciseID = items.exerciseID;
                    ExerciseService.saveComment(comment).success(function (data) {
                        toastr.success(data.message);
                        $uibModalInstance.close();
                    }).error(function (status, data) {
                        toastr.error(data.message);
                    });
                }
                if (items.workoutID != null) {
                    comment.workoutID = items.workoutID;
                    WorkoutService.saveComment(comment).success(function (data) {
                        toastr.success(data.message);
                        $uibModalInstance.close();
                    }).error(function (status, data) {
                        toastr.error(data.message);
                    });
                }
            }

        };


        $scope.hoveringOver = function (value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

    }
]);