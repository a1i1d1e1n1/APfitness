/**
 * Created by nm on 2/17/2016.
 */
angular.module('App').controller('UserHomeCtrl', function ($rootScope, $scope, UserService, $compile, $timeout, uiCalendarConfig, toastr, WorkoutService, $location, GoogleService) {
    $rootScope.hidemenu = false;
    $scope.events = [
        {
            title: 'Event1',
            start: '2014-07-19'
        }
    ];


    $scope.eventSources = [$scope.events];

    GoogleService.events().success(function (data) {
        var a = data.items;
        for (var i = 0; i < a.length; i++) {
            addEvent(a[i].summary, a[i].start.dateTime, a[i].end.dateTime);
        }
    }).error(function (status, data) {
        console.log(status);
        console.log(data);
    });

    var getWorkouts = function () {
        WorkoutService.getAssignWorkout().success(function (data) {
            for (var i = 0; i < data.length; i++) {
                addEvent(data[i].workoutName, data[i].start_date, data[i].end_date);
            }
            $scope.eventSources = $scope.events;

        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });
    };

    $scope.getevent = function () {


    };
    var addEvent = function (title, start, end) {

        $scope.events.push({
            title: title,
            start: new Date(start),
            end: new Date(end),
            stick: true,
            allDay: false
        });
    };

    $scope.createWorkout = function () {
        $location.path("/createworkout");
    };

    $scope.uiConfig = {
        calendar: {

            editable: true,
            header: {
                left: 'month basicWeek basicDay agendaWeek agendaDay',
                center: 'title',
                right: 'today prev,next'
            }

        }
    };

    getWorkouts();



});
