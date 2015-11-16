(function () {
  "use strict";

  // Declare app level module which depends on filters, and services
  var module = angular.module('App', [
    'ngRoute',
    'App.controllers',
    'navigation.controllers',
    'App.factories'
  ]);


  module.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', { templateUrl: 'views/home.ejs', controller: 'homeCtrl' });
    $routeProvider.when('/404', { templateUrl: '/views/404.html' });
    $routeProvider.otherwise({ redirectTo: '/' });


  }]);

})();
