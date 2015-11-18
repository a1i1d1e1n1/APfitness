/**
 * Created by nm on 10/30/2015.
 */
var app = angular.module('App.factories', []);

app.factory('author', ['$http', function ($http) {

    var a = {
        authors: []
    };

    a.getAll = function() {
        return $http.get('/author').success(function(data){
            angular.copy(data, a.authors);
            return a;
        });
    };
    a.setAll = function(user) {
        return $http.post('/register',user).success(function(data){
            angular.copy(data, a.authors);

        });
    };
    a.login = function(user) {
        return $http.post('/login',user).success(function(data){
            angular.copy(data, a.authors);

        });
    };

    return a;

    }
]);