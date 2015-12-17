/**
 * Created by nm on 10/30/2015.
 */
var app = angular.module('App.factories', []);

app.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    }

    return auth;
});

app.factory('UserService', function ($http) {
    return {
        signIn: function(email, password) {
            return $http.post('api/login', {email: email, password: password});
        },

        logOut: function() {
            return $http.get('api/logout');
        },

        register: function(email, password, passwordConfirmation) {
            return $http.post('api/register', {email: email, password: password, passwordConfirmation: passwordConfirmation });
        },

        users: function() {
            return $http.get('api/user');
        },

        checkAdmin: function() {
            return $http.get('api/user/checkAdmin');
        },

        passwordReset: function(email) {
            return $http.post('api/passwordReset', {email: email});
        }



    }
});
app.factory('ExerciseService', function ($http) {
    return {
        getAllExercises: function() {
            return $http.get('api/exercise');
        },

    }
});


app.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService, $rootScope) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if ($window.sessionStorage.token) {
                config.headers.Authorization = $window.sessionStorage.token;
            }
            return config;
        },

        requestError: function(rejection) {
            return $q.reject(rejection);
        },

        /* Set Authentication.isAuthenticated to true if 200 received */
        response: function (response) {
            if (response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAuthenticated) {
                AuthenticationService.isAuthenticated = true;
                $rootScope.isAuthenticated = true;
            }
            if ((response != null && response.status == 200 && $window.sessionStorage.token && !AuthenticationService.isAdmin)){

            }
            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                $rootScope.isAuthenticated = false;
                AuthenticationService.isAuthenticated = false;
                AuthenticationService.isAdmin = false;
                $location.path("/");
            }

            return $q.reject(rejection);
        }
    };
});