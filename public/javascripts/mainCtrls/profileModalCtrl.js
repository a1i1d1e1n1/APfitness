/**
 * Created by aiden on 06/03/2016.
 */

/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('ProfileModalCtrl', ['$scope', 'UserService', 'items', '$uibModalInstance', 'toastr',
    function ($scope, UserService, items, $uibModalInstance, toastr) {

        $scope.profile = angular.copy(items);

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.saveProfile = function (profile) {
            if (profile.first_name == "" || profile.last_name == "") {
                toastr.error("Please enter comment");
            } else {
                UserService.saveProfile(profile).success(function (data) {
                    toastr.success(data.message);
                    $uibModalInstance.close();
                }).error(function (status, data) {
                    toastr.error(data.message);
                });

            }

        };
    }
]);