
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
    $routeProvider.when('/adminHome', { templateUrl: '/views/adminHome.ejs', access: { requiredAuthentication: true , requiredAdmin:true} });
    $routeProvider.when('/forgotPassword', { templateUrl: '/views/forgotPassword.ejs', access: { requiredAuthentication: false }, controller: 'PasswordResetCtrl' });
    $routeProvider.otherwise({ redirectTo: '/' });
  }]);

  app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('TokenInterceptor');
  });

  app.run(function($rootScope, AuthenticationService, UserService,$location) {
    UserService.checkAdmin().success(function(data) {
      if(data == 1){
        AuthenticationService.isAdmin = true;
        $location.path("/adminHome");
      }
    });
  });

  app.run(function($rootScope, $location, AuthenticationService, $window) {
    $rootScope.$on("$routeChangeStart", function(event, nextRoute, currentRoute) {

      //  If the users is authenticated and has a token they will not be able to access routes
      //  such as login page etc. They will be redirected to user home.
      if (nextRoute != null && nextRoute.access != null && $window.sessionStorage.token &&
          (!nextRoute.access.requiredAuthentication && AuthenticationService.isAuthenticated) ||
          (nextRoute.access.requiredAdmin && !AuthenticationService.isAdmin) ) {
        $location.path("/userHome");
      }


      //  If the users is not authenticated  they will not be able to access routes that require authentication.
      //  They will be redirected to login page.
      if (nextRoute != null && nextRoute.access != null && nextRoute.access.requiredAuthentication
          && !AuthenticationService.isAuthenticated && !$window.sessionStorage.token) {
        $location.path("/");
      }

    });
  });





