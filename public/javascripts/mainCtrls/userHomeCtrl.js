/**
 * Created by nm on 2/17/2016.
 */
angular.module('App').controller('UserHomeCtrl', ['$scope', 'UserService', 'toastr', 'WorkoutService', '$location',
    function ($scope, UserService, toastr, WorkoutService, $location) {
        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        $scope.profile = {first_name: "", last_name: ""};

        WorkoutService.getAssignWorkout().success(function (data) {
            for (var i = 0; i < data.length; i++) {
                addEvent(data[i].workoutName, data[i].start_date, data[i].end_date);
            }
        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });

        var addEvent = function (title, start, end) {
            $scope.events.push({
                title: title,
                start: start,
                end: end
            });
        };

        $scope.createWorkout = function () {
            $location.path("/createworkout");
        };

        $scope.uiConfig = {
            calendar: {
                height: 200,
                editable: true,
                header: {
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title',
                    right: 'today prev,next'
                },
                eventClick: $scope.alertOnEventClick,
                dayClick: $scope.alertEventOnClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize
            }
        };

        $scope.alertOnEventClick = function (date, jsEvent, view) {
            $scope.alertMessage = (date.title + ' was clicked ');
        };

        $scope.events = [];


        $scope.eventSources = [$scope.events];



    }
]);