"use strict";

// Declare app level module which depends on filters, and services

var app = angular.module('App', [
    'ngRoute',
    'App.factories',
    'navigation.controllers',
    'ui.calendar',
    'toastr',
    'angularUtils.directives.dirPagination',
    'ngDraggable',
    'App.Directives',
    'ngTouch',
    'ui.bootstrap',
    'ui.calendar',
    'chart.js',
    'ui.grid',
    'angularSpinner'
]);

app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setTheme('bigBlue', {
        lines: 13 // The number of lines to draw
        , length: 40 // The length of each line
        , width: 14 // The line thickness
        , radius: 42 // The radius of the inner circle
        , scale: 1 // Scales overall size of the spinner
        , corners: 1 // Corner roundness (0..1)
        , color: '#48C9B0' // #rgb or #rrggbb or array of colors
        , opacity: 0.25 // Opacity of the lines
        , rotate: 0 // The rotation offset
        , direction: 1 // 1: clockwise, -1: counterclockwise
        , speed: 1 // Rounds per second
        , trail: 60 // Afterglow percentage
        , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
        , zIndex: 2e9 // The z-index (defaults to 2000000000)
        , className: 'spinner' // The CSS class to assign to the spinner
        , top: '50%' // Top position relative to parent
        , left: '50%' // Left position relative to parent
        , shadow: true // Whether to render a shadow
        , hwaccel: false // Whether to use hardware acceleration
        , position: 'absolute' // Element positioning
    });
}]);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    $routeProvider.when('/', {
        templateUrl: 'views/home.ejs',
        controller: 'AdminUserCtrl',
        access: {requiredAuthentication: false}
    });
    $routeProvider.when('/login', {
        templateUrl: 'views/login.ejs',
        controller: 'AdminUserCtrl',
        access: {requiredAuthentication: false}
    });
    $routeProvider.when('/register', {
        templateUrl: 'views/register.ejs',
        controller: 'AdminUserCtrl',
        access: {requiredAuthentication: false}
    });
    $routeProvider.when('/404', {templateUrl: '/views/404.ejs'});
    $routeProvider.when('/userHome', {
        templateUrl: '/views/userHome.ejs',
        access: {requiredAuthentication: true},
        controller: 'UserHomeCtrl'
    });
    $routeProvider.when('/exercises', {
        templateUrl: '/views/exercises.ejs',
        access: {requiredAuthentication: true},
        controller: 'ExerciseCtrl'
    });
    $routeProvider.when('/adminHome', {
        templateUrl: '/views/adminHome.ejs',
        access: {requiredAuthentication: true, requiredAdmin: true}
    });
    $routeProvider.when('/createworkout', {
        templateUrl: '/views/createWorkout.ejs',
        access: {requiredAuthentication: true},
        controller: 'CreateWorkoutCtrl'
    });
    $routeProvider.when('/forgotPassword', {
        templateUrl: '/views/forgotPassword.ejs',
        access: {requiredAuthentication: false},
        controller: 'PasswordResetCtrl'
    });
    $routeProvider.when('/workouts', {
        templateUrl: '/views/workouts.ejs',
        access: {requiredAuthentication: true},
        controller: 'WorkoutCtrl'
    });
    $routeProvider.when('/assigned', {
        templateUrl: '/views/assignedWorkouts.ejs',
        access: {requiredAuthentication: true},
        controller: 'AssignedWorkoutCtrl'
    });
    $routeProvider.when('/profile', {
        templateUrl: '/views/profile.ejs',
        access: {requiredAuthentication: true},
        controller: 'ProfileCtrl'
    });

}]);


app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
});

app.config(function (toastrConfig) {
    angular.extend(toastrConfig, {
        autoDismiss: false,
        containerId: 'toast-container',
        maxOpened: 0,
        extendedTimeOut: 1000,
        timeOut: 2000,
        newestOnTop: true,
        positionClass: 'toast-bottom-right',
        preventDuplicates: false,
        preventOpenDuplicates: false,
        target: 'body'
    });
});


app.run(function ($rootScope, $location, AuthenticationService, $window, toastr, UserService, ProfileService, $q) {

    $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {


        var promise = checkAuth(ProfileService, $window, UserService, AuthenticationService, $q);
        promise.then(function () {
            //  If the users is authenticated and has a token they will not be able to access routes
            //  such as login page etc. They will be redirected to user home.
            if (nextRoute != null && nextRoute.access != null && $window.sessionStorage.token &&
                (!nextRoute.access.requiredAuthentication && AuthenticationService.isAuthenticated) ||
                (nextRoute.access.requiredAdmin && !AuthenticationService.isAdmin)) {
                $location.path("/userHome");
                toastr.info("you are already logged in");
            }
        }, function (reason) {
            //  If the users is not authenticated  they will not be able to access routes that require authentication.
            //  They will be redirected to login page.
            if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication
                && AuthenticationService.isAuthenticated == false) {
                $location.path("/login");
                toastr.info("Please log in first");
            }
        });

        if (nextRoute.access.requiredAdmin) {
            UserService.checkAdmin().success(function (data) {
                if (data == 1) {
                    AuthenticationService.isAdmin = true;
                    $location.path("/adminHome");
                }
            });
        }
    });
});

//Allows youtube videos to be embedded dynamically
app.config(['$routeProvider', '$sceDelegateProvider',
    function ($routeProvider, $sceDelegateProvider) {

        $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);

    }]);



function checkAuth(ProfileService, $window, UserService, AuthenticationService, $q) {
    return $q(function (resolve, reject) {
        setTimeout(function () {
            if ($window.sessionStorage.token) {
                UserService.checkAuth().success(function (data) {
                    ProfileService.first_name = data.first_name;
                    ProfileService.last_name = data.last_name;
                    ProfileService.userID = data.ID;
                    AuthenticationService.isAuthenticated = true;
                    resolve();
                }).error(function (data) {
                    delete $window.sessionStorage.token;
                    AuthenticationService.isAuthenticated = false;
                    ProfileService.first_name = "";
                    ProfileService.last_name = "";
                    ProfileService.userID = "";

                });
            } else {
                reject();
            }

        }, 1);
    });


}
