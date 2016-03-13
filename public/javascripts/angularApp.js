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
    'gapi'
]);


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


app.run(function ($rootScope, $location, AuthenticationService, $window, toastr, UserService, ProfileService) {
    $rootScope.$on("$routeChangeStart", function (event, nextRoute, currentRoute) {

        checkProfile(ProfileService, $window);


        if (nextRoute.access.requiredAdmin) {
            UserService.checkAdmin().success(function (data) {
                if (data == 1) {
                    AuthenticationService.isAdmin = true;
                    $location.path("/adminHome");
                }
            });
        }

        //  If the users is authenticated and has a token they will not be able to access routes
        //  such as login page etc. They will be redirected to user home.
        if (nextRoute != null && nextRoute.access != null && $window.sessionStorage.token &&
            (!nextRoute.access.requiredAuthentication && AuthenticationService.isAuthenticated) ||
            (nextRoute.access.requiredAdmin && !AuthenticationService.isAdmin)) {
            $location.path("/userHome");
            toastr.info("you are already logged in");
        }


        //  If the users is not authenticated  they will not be able to access routes that require authentication.
        //  They will be redirected to login page.
        if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication
            && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
            $location.path("/login");
            toastr.info("Please log in first");
        }

    });
});

//Allows youtube videos to be embedded dynamically
app.config(['$routeProvider', '$sceDelegateProvider',
    function ($routeProvider, $sceDelegateProvider) {

        $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);

    }]);

app.value('GoogleApp', {
    apiKey: 'AIzaSyAEp--6Nm1MNnDIanhBa9cg4GBKEs-Edi4',
    clientId: '86288733958-nsqjpjkpjpnmel29l6hou0k64v3rnqnb.apps.googleusercontent.com',
    scopes: [
        // whatever scopes you need for your app, for example:
        'https://www.googleapis.com/auth/calendar',
        'https://www.googleapis.com/auth/userinfo.profile'
        // ...
    ]
});

var checkProfile = function (ProfileService, $window) {

    if ($window.sessionStorage.first_name || $window.sessionStorage.last_name) {
        ProfileService.first_name = $window.sessionStorage.first_name;
        ProfileService.last_name = $window.sessionStorage.last_name;
        ProfileService.userID = $window.sessionStorage.user_id;
    }
};
