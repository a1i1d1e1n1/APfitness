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


    return a;

    }
]);