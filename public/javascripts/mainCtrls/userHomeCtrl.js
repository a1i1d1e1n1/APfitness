/**
 * Created by nm on 2/17/2016.
 */
angular.module('App').controller('UserHomeCtrl', function ($rootScope, $scope, UserService, $compile, $timeout, uiCalendarConfig, toastr, WorkoutService, $location, GoogleService) {

    $scope.alertOnEventClick = function (date, jsEvent, view) {
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    // Eventscope that stores all workout events and styles them different colours
    $scope.events = [

    ];

    // Eventscope that stores all google events and styles them different colours
    $scope.google_events = {
        color: '#FFA500',
        textColor: 'white',
        events: []
    };

    //The scope used to display the events on the calendar, can use multiple eventsources.
    $scope.eventSources = [$scope.events, $scope.google_events];

    GoogleService.events().success(function (data) {
        if (data) {
            //Assign google events to an eventsource
            var a = data.items;
            for (var i = 0; i < a.length; i++) {
                addGoogleEvent(a[i].summary, a[i].start.dateTime, a[i].end.dateTime);
            }
        }

    }).error(function (status, data) {
        console.log(status);
        console.log(data);
    });


    //Gets the workouts that the user has assigned to his calendar
    var getWorkouts = function () {
        WorkoutService.getAssignWorkout().success(function (data) {
            //Assigns these workout to the calendar.
            for (var i = 0; i < data.length; i++) {
                addEvent(data[i].workoutName, data[i].start_date, data[i].end_date);
            }
            $scope.eventSources = $scope.events;

        }).error(function (status, data) {
            console.log(status);
            console.log(data);
        });
    };

    //Method used to add events to the workout eventscope
    var addEvent = function (title, start, end) {

        $scope.events.push({
            title: title,
            start: new Date(start),
            end: new Date(end),
            stick: true,
            allDay: false
        });
    };
    //Method used to add events to the google eventscope
    var addGoogleEvent = function (title, start, end) {

        $scope.google_events.events.push({
            title: title,
            start: new Date(start),
            end: new Date(end),
            stick: true,
            allDay: false
        });
    };


    //Configuration for the calendar.
    $scope.uiConfig = {
        calendar: {

            editable: false,
            header: {
                left: 'title',
                center: 'month agendaWeek agendaDay',
                right: 'today prev,next'
            }

        },
        eventClick: $scope.alertOnEventClick
    };


    //Gets the workout for the week to show the user how many have been completed.
    WorkoutService.getWeeklyWorkout().success(function (data) {
        if (data.length > 0) {
            $scope.recent_workouts = data;

            console.log(data);
        }

    }).error(function (status, data) {
        console.log(status);
        console.log(data);
    });

    getWorkouts();



});
