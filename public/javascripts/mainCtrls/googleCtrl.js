/**
 * Created by aiden on 23/03/2016.
 */
angular.module('App').controller('GoogleCtrl', ['$scope', 'GoogleService',
    function ($scope, GoogleService) {

        GoogleService.callback(code).success(function (data) {

        });
    }
]);