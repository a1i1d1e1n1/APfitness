
  "use strict";

  // Declare app level module which depends on filters, and services
  var app  = angular.module('App', [
    'ngRoute',
    'App.factories',
    'navigation.controllers',
    'App.controllers',
    'ui.calendar'
  ]);



  app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', { templateUrl: 'views/home.ejs', controller: 'AdminUserCtrl', access: { requiredAuthentication: false }});
    $routeProvider.when('/login', { templateUrl: 'views/login.ejs', controller: 'AdminUserCtrl', access: { requiredAuthentication: false } });
    $routeProvider.when('/register', { templateUrl: 'views/register.ejs', controller: 'AdminUserCtrl', access: { requiredAuthentication: false } });
    $routeProvider.when('/404', { templateUrl: '/views/404.ejs'});
    $routeProvider.when('/userHome', { templateUrl: '/views/userHome.ejs', access: { requiredAuthentication: true }, controller: 'UserHomeCtrl' });
    $routeProvider.otherwise({ redirectTo: '/' });


  }]);

  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
  });

  app.run(function($rootScope, $location, AuthenticationService, $window) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

      if (nextRoute != null && nextRoute.access != null && !nextRoute.access.requiredAuthentication
          && AuthenticationService.isAuthenticated && $window.sessionStorage.token) {
        $location.path("/userHome");
      }

      if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication
          && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
        $location.path("/");
      }

    });
  });





