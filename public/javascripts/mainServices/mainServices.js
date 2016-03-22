/**
 * Created by Aiden on 10/30/2015.
 */
var app = angular.module('App.factories', []);

app.factory('AuthenticationService', function() {
    var auth = {
        isAuthenticated: false,
        isAdmin: false
    };

    return auth;
});

app.factory('ProfileService', function () {
    var profile = {
        first_name: "",
        last_name: "",
        userID: null
    };

    return profile;
});

app.factory('UserService', function ($http) {
    return {
        signIn: function(email, password) {
            return $http.post('api/login', {email: email, password: password});
        },

        logOut: function() {
            return $http.get('api/logout');
        },

        checkAuth: function () {
            return $http.get('api/auth');
        },
        register: function(email, password, passwordConfirmation) {
            return $http.post('api/register', {email: email, password: password, passwordConfirmation: passwordConfirmation });
        },

        users: function() {
            return $http.get('api/user');
        },
        profile: function () {
            return $http.get('api/user/profile');
        },
        saveProfile: function (profile) {
            return $http.post('api/user/profile', {profile: profile});
        },
        checkAdmin: function() {
            return $http.get('api/user/checkAdmin');
        },

        passwordReset: function(email) {
            return $http.post('api/passwordReset', {email: email});
        }



    }
});

//Gets data from the api/exercises
app.factory('ExerciseService', function ($http) {
    return {
        getAllExercises: function() {
            return $http.get('api/exercise');
        },
        getAllComments: function (id) {
            return $http.get('api/exercise/comments/' + id);
        },
        saveComment: function (comment) {
            return $http.post('api/exercise/comment/save', {comment: comment});
        },
        deleteComment: function (comment) {
            return $http.post('api/exercise/comment/delete', {comment: comment});
        }

    }
});

app.factory('GoogleService', function ($http) {
    return {
        auth: function () {
            return $http.get('googleapi/auth');
        },
        getAllEvents: function (id) {
            return $http.get('googleapi/auth');
        },
        saveComment: function (comment) {
            return $http.post('api/exercise/comment/save', {comment: comment});
        },
        deleteComment: function (comment) {
            return $http.post('api/exercise/comment/delete', {comment: comment});
        }

    }
});

app.factory('WorkoutService', function ($http) {
    return {
        getAllWorkouts: function() {
            return $http.get('api/workout');
        },
        saveWorkout: function(workout) {
            return $http.post('api/workout/save', {workout: workout});
        },
        getAllWorkoutsExercise: function () {
            return $http.get('api/workout/AllWorkoutExercises')
        },
        assignWorkout: function (workout, datetime) {
            return $http.post('api/workout/assign', {workout: workout, datetime: datetime})
        },
        getAssignWorkout: function () {
            return $http.get('api/workout/assigned')
        },
        getAllComments: function (id) {
            return $http.get('api/workout/comments/' + id)
        },
        saveComment: function (comment) {
            return $http.post('api/workout/comment/save', {comment: comment});
        },
        getMostRecent: function () {
            return $http.get('api/workout/recent');
        },
        deleteComment: function (comment) {
            return $http.post('api/workout/comment/delete', {comment: comment});
        }
    }
});

app.factory('TokenInterceptor', function ($q, $window, $location, AuthenticationService, ProfileService, $rootScope, toastr) {
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

            return response || $q.when(response);
        },

        /* Revoke client authentication if 401 is received */
        responseError: function(rejection) {
            if (rejection != null && rejection.status === 401 && ($window.sessionStorage.token || AuthenticationService.isAuthenticated)) {
                delete $window.sessionStorage.token;
                $rootScope.isAuthenticated = false;
                AuthenticationService.isAuthenticated = false;
                AuthenticationService.isAdmin = false;
                ProfileService.first_name = "";
                ProfileService.last_name = "";
                ProfileService.userID = null;
                toastr.success("Your session has expired please log in again :)");
                $location.path("/login");

            }

            return $q.reject(rejection);
        }
    };
});