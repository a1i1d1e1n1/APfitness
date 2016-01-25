/**
 * Created by aiden on 03/01/2016.
 */

var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'maddog_1',
    database: 'ApFitness'
});

// route middleware to verify a token
router.use(function (req, res, next) {

    console.log(req.headers.authorization);
    // check header or url parameters or post parameters for token
    var token = req.headers.authorization;

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, secret.secretToken, function (err, decoded) {
            if (err) {

                return res.json({success: false, message: 'Failed to authenticate token.'});
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                console.log(decoded);
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

router.route('/')
    // fetch all Workouts
    .get(function (req, res, next) {

        var user = req.decoded;
        console.log(user);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * from workout', function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    console.log('Error while performing Query.');
            });
        })
    });

router.route('/save')
    // fetch all users
    .post(function (req, res, next) {

        var user = req.decoded;
        var workout = req.body.workout;
        var workoutID = {};

        pool.getConnection().then(function (connection) {
            connection.query('Insert into workout (name,description,rating,userID) VALUES (' + connection.escape(workout.name) + ',' +
                connection.escape(workout.name) + ',' + connection.escape(0) + ',' + connection.escape(3) + ')').then(function (rows) {
                var workoutID = rows.insertId;
                insertExercises(workoutID, connection);
            }).catch(function (err) {
                done(err);
            });


            var insertExercises = function (workoutID, connection) {

                for (var i = 0; i < workout.exercises.length; i++) {
                    var exercise = workout.exercises[i]

                    connection.query('Insert into workout_exercise (duration,workoutID,exerciseId) VALUES (' + connection.escape(30) + ',' +
                        connection.escape(workoutID) + ',' + connection.escape(exercise.exerciseID) + ')').then(function (rows) {

                        var workoutExerciseID = rows.insertId;
                        insertSets(workoutExerciseID, i, connection);

                    });
                }

            };

            var insertSets = function (workoutExerciseID, connection) {

                for (var j = 0; j < workout.exercises[i].sets.length; i++) {
                    var set = workout.exercises[i].sets[j];

                    connection.query('Insert into sets (reps,weight,workout_exerciseID) VALUES (' + connection.escape(set.reps) + ',' +
                        connection.escape(set.weight) + ',' + connection.escape(workoutExerciseID) + ')', function (err, rows, fields) {
                        connection.release();
                        if (err) {
                            console.log(err);
                        }
                    });

                }

            };

        });
    });
module.exports = router;