/* global angular */
(function () {
    "use strict";

    var app = angular.module('App.controllers', []);

    app.controller('homeCtrl', ['$rootScope', '$scope', 'author',
         function ($rootScope, $scope, author) {

             $scope.getAuthors = function(){
                var user = {email:"testemail.com", password:"Jacob"};
                 author.setAll(user).success(function(data) {
                     var a = data;
                     var b = 6;
                 });
                }


         }
    ]);

    app.controller('loginCtrl', ['$rootScope', '$scope', 'author',
        function ($rootScope, $scope, author) {
            $scope.user = {};
            $scope.logIn = function(){

                author.login($scope.user).success(function(data) {
                    var a = data;
                    var b = 6;
                });
            }


        }
    ]);

})();

