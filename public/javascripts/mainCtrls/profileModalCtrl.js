/**
 * Created by aiden on 06/03/2016.
 */

/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('ProfileModalCtrl', ['$scope', 'UserService', 'items', '$uibModalInstance', 'toastr',
    function ($scope, UserService, items, $uibModalInstance, toastr) {

        $scope.profile = items;


    }
]);