/* global angular */
(function () {
    "use strict";

    var app = angular.module('App.controllers', []);

    app.controller('homeCtrl', ['$rootScope', '$scope', 'author',
         function ($rootScope, $scope, author) {

             $scope.getAuthors = function(){

                 author.getAll().success(function(data) {
                     var a = data;
                     var b = 6;
                 });
                }


         }
    ]);

})();

