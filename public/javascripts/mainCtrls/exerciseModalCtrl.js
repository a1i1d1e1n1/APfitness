/**
 * Created by aiden on 26/02/2016.
 */

angular.module('App').controller('ExerciseModalCtrl', ['$scope', 'ExerciseService', 'toastr', 'items', '$uibModalInstance',
    function ($scope, ExerciseService, toastr, items, $uibModalInstance) {

        $scope.exercise = items;

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };


    }
]);