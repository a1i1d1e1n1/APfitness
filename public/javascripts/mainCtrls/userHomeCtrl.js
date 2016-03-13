/**
 * Created by nm on 2/17/2016.
 */
angular.module('App').controller('UserHomeCtrl', function ($rootScope, $scope, UserService, toastr, WorkoutService, $location, GAPI, Calendar) {

        $rootScope.hidemenu = false;
    $scope.events = [
        {
            title: 'Event1',
            start: '2014-07-19'
        }
    ];
    $scope.eventSources = [$scope.events];

    GAPI.init().then(function (data) {
        Calendar.getCalendars('primary').then(function (data) {

            var gevents = data.items;
        });
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
                }

            }
        };



        getWorkouts();


});
