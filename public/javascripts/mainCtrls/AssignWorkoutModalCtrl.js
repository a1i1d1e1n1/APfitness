/**
 * Created by Aiden Pert on 2/17/2016.
 *
 * The controller for assigning a workout Modal. It gets the selected workout passed in 'items' and lets the users pick
 * the date of the workout and assign it to there schedule.
 */

angular.module('App').controller('AssignWorkoutModalCtrl', ['$scope', '$uibModalInstance', 'WorkoutService', 'items', 'toastr', '$location',
    function ($scope, $uibModalInstance, WorkoutService, items, toastr, $location) {

        $scope.event = [];

        // Eventscope that stores all google events and styles them different colours
        $scope.google_events = {
            color: '#FFA500',
            textColor: 'white',
            events: []
        };

        //The scope used to display the events on the calendar, can use multiple eventsources.
        $scope.eventSources = [$scope.event, $scope.google_events];

        //Assign the workout being passed into controller
        $scope.workout = items;

        //The increments the timepicker uses for hours and minutes.
        $scope.hstep = 1;
        $scope.mstep = 15;

        //The formats of the date and selecting the first one.
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        //Feature to let user select the timepicker increments.
        $scope.options = {
            hstep: [1, 2, 3],
            mstep: [1, 5, 10, 15, 25, 30]
        };

        $scope.uiConfig = {
            calendar: {

                editable: false,
                header: {
                    left: 'title',
                    center: ' agendaWeek ',
                    right: 'today prev,next'
                }

            }
        };


        var getWorkouts = function () {
            WorkoutService.getAssignWorkout().success(function (data) {
                //Assigns these workout to the calendar.
                for (var i = 0; i < data.length; i++) {
                    addEvent(data[i].workoutName, data[i].start_date, data[i].end_date);
                }
                $scope.eventSources = $scope.event;

            }).error(function (status, data) {
                console.log(status);
                console.log(data);
            });
        };

        //Method used to add events to the workout eventscope
        var addEvent = function (title, start, end) {

            $scope.event.push({
                title: title,
                start: new Date(start),
                end: new Date(end),
                stick: true,
                allDay: false
            });
        };

        getWorkouts();

        //Assigns a workout to the users schedule by calling workout service and handles response.
        $scope.assignWorkout = function (datetime) {
            if (datetime) {
                WorkoutService.assignWorkout($scope.workout, datetime).success(function (data) {
                    console.log(data);
                    toastr.success("Workout has been assigned to your calender");
                    $location.path("/userHome");
                    $uibModalInstance.dismiss('cancel');

                }).error(function (status, data) {
                    toastr.info(status.message);
                    console.log(status);
                    console.log(data);
                });
            } else {
                toastr.info("Please ensure you have entered a valid date and time");
            }


        };

        //Closes the Modal
        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

        //Assigns the dt to today on load.
        $scope.today = function () {
            $scope.dt = new Date();
        };

        //Sets the min date so no past dates can be selected
        $scope.toggleMin = function () {
            $scope.minDate = $scope.minDate ? null : new Date();
        };

        //Displays the datepicker.
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        //Assigns a new value to dt when the user selects a new date.
        $scope.setDate = function (year, month, day) {
            $scope.dt = new Date(year, month, day);
        };

        //DatePicker Settings
        $scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };

        //Closes the datepicker
        $scope.popup1 = {
            opened: false
        };

        var tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        var afterTomorrow = new Date();
        afterTomorrow.setDate(tomorrow.getDate() + 1);
        $scope.events =
            [
                {
                    date: tomorrow,
                    status: 'full'
                },
                {
                    date: afterTomorrow,
                    status: 'partially'
                }
            ];


        $scope.getDayClass = function (date, mode) {
            if (mode === 'day') {
                var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

                for (var i = 0; i < $scope.events.length; i++) {
                    var currentDay = new Date($scope.events[i].date).setHours(0, 0, 0, 0);

                    if (dayToCheck === currentDay) {
                        return $scope.events[i].status;
                    }
                }
            }

            return '';
        };

        $scope.ismeridian = true;
        $scope.toggleMode = function () {
            $scope.ismeridian = !$scope.ismeridian;
        };

        $scope.update = function () {
            var d = new Date();
            d.setHours(14);
            d.setMinutes(0);
            $scope.dt = d;
        };

        //Sets the dt to null
        $scope.clear = function () {
            $scope.dt = null;
        };

        $scope.today();
        $scope.toggleMin();

    }
]);