/**
 * Created by nm on 2/17/2016.
 */

angular.module('App').controller('ExerciseCtrl', ['$rootScope', '$scope', 'ExerciseService', 'toastr', '$uibModal',
    function($rootScope, $scope, ExerciseService, toastr, $uibModal) {

        //Sets up the configuration and variables needed on page startup.
        var initialise = function () {
            //Variables set on page load
            $scope.currentPage = 1;
            $scope.pageSize = 8;
            $scope.exercises = [];
            $scope.searchType = 2;
            $scope.selectedExercise = 1;
            $scope.max = 5;
            $rootScope.hidemenu = false;

            slider();
            focusButtons();


            $("select").select2({dropdownCssClass: 'dropdown-inverse'});
        };


        var slider = function () {
            var $slider = $("#slider");

            if ($slider.length > 0) {
                $slider.slider({
                    min: 8,
                    max: 24,
                    value: $scope.pageSize,
                    orientation: "horizontal",
                    range: "min",
                    slide: function (event, ui) {
                        $scope.$apply(function () {
                            $scope.pageSize = ui.value;
                        });
                    }

                }).addSliderSegments($slider.slider("option").max);
            }
        };


        $scope.openExercise = function (exercise) {

            var modalInstance = $uibModal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'views/Modals/exerciseModal.html',
                controller: 'ExerciseModalCtrl',
                resolve: {
                    items: function () {
                        return exercise;
                    }
                }
            });
        };


        ExerciseService.getAllExercises().success(function(data) {
            $scope.exercises = data;
        }).error(function(status, data) {
            console.log(status);
            console.log(data);
        });


        $scope.pageChangeHandler = function(num) {
            console.log('meals page changed to ' + num);
        };

        $scope.searchType = function(type) {
            console.log(type);
        };

        var focusButtons = function() {
            $('.input-group').on('focus', '.form-control', function () {
                $(this).closest('.form-group').addClass('focus');
            }).on('blur', '.form-control', function () {
                $(this).closest('.form-group').removeClass('focus');
            });
        };

        initialise();
    }
]);