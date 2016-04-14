/**
 * Created by nm on 2/17/2016.
 */
angular.module('App').controller('UserHomeCtrl', function ($rootScope, $scope, UserService, $compile, $timeout, uiCalendarConfig, toastr, WorkoutService, $location, GoogleService) {
    $rootScope.hidemenu = false;
    $scope.events = [

    ];

    $scope.google_events = {
        color: '#FFA500',
        textColor: 'white',
        events: []
    };

    $scope.eventSources = [$scope.events, $scope.google_events];

    GoogleService.events().success(function (data) {
        var a = data.items;
        for (var i = 0; i < a.length; i++) {
            addGoogleEvent(a[i].summary, a[i].start.dateTime, a[i].end.dateTime);
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

    var addEvent = function (title, start, end) {

        $scope.events.push({
            title: title,
            start: new Date(start),
            end: new Date(end),
            stick: true,
            allDay: false
        });
    };

    var addGoogleEvent = function (title, start, end) {

        $scope.google_events.events.push({
            title: title,
            start: new Date(start),
            end: new Date(end),
            stick: true,
            allDay: false
        });
    };

    $scope.uiConfig = {
        calendar: {

            editable: false,
            header: {
                left: 'title',
                center: 'month agendaWeek agendaDay',
                right: 'today prev,next'
            }

        }
    };

    getWorkouts();



});
