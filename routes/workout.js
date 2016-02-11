/**
 * Created by aiden on 03/01/2016.
 */

var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql');
var Promise = require("bluebird");
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'maddog_1',
    database: 'ApFitness'
});

var getExercises = function (ID,connection){
    return new Promise(function(resolve,reject) {
        connection.query('SELECT * FROM apfitness.workout_exercises WHERE workoutID = ' +  connection.escape(ID), function (err, rows, fields) {
            if (err) {
                console.log(err);
                reject(err);
            }else{
                resolve(rows);
            }
        });
    });
};

var insertExercises = function (workoutID, exercise, connection) {
    return new Promise(function(resolve,reject){
        connection.query('Insert into workout_exercise (duration,workoutID,exerciseId) VALUES (' + connection.escape(30) + ',' +
            connection.escape(workoutID) + ',' + connection.escape(exercise.exerciseID) + ')', function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    reject(err);
                }else{
                    console.log("Inserted Exercise: " + exercise.name);
                    exercise.insertedId = rows.insertId;
                    resolve(exercise);
                }
        });
    });


};

var insertSets = function (set,insertedID, connection) {

        connection.query('Insert into sets (reps,weight,workout_exerciseID) VALUES (' + connection.escape(set.reps) + ',' +
            connection.escape(set.weight) + ',' + connection.escape(insertedID) + ')', function (err, rows, fields) {

            if (err) {
                console.log(err);
            }else{
                console.log("inserted set: " + set);
            }
        });

};

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

router.route('/AllWorkoutExercises')
    // fetch all Workouts_exercises
    .get(function (req, res, next) {

        var user = req.decoded;

        var workouts = [{

        }];

        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM workout_exercises;', function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    console.log('Error while performing Query.' + err);
            });
        })

    });

router.route('/save')
    // fetch all users
    .post(function (req, res, next) {

        var user = req.decoded;
        var workout = req.body.workout;
        var workoutID = 0;

        pool.getConnection().then(function (connection) {
            connection.query('Insert into workout (workoutName,description,rating,userID) VALUES (' + connection.escape(workout.name) + ',' +
                connection.escape(workout.name) + ',' + connection.escape(0) + ',' + connection.escape(3) + ')').then(function (rows) {
                workoutID = rows.insertId;

                for (var i = 0; i < workout.exercises.length; i++) {
                    var exercise = workout.exercises[i]

                    insertExercises(workoutID, exercise, connection).then(function(results){
                        for (var j = 0; j < results.sets.length; j++) {
                            insertSets(results.sets[j],results.insertedId,connection);
                        }
                    });

                }

                res.json("completed");
            }).catch(function (err) {
                console.log(err);
            });
        });


    });

router.route('/assign')
    // fetch all users
    .post(function (req, res, next) {

        var user = req.decoded;
        var workout = req.body.workout;

        var dateTime = new Date(req.body.date + " " + req.body.time);

        pool.getConnection().then(function (connection) {
            connection.query('Insert into assinged_workout (start_date,end_date,userID,workoutID) VALUES (' + connection.escape(dateTime) + ',' +
                connection.escape(dateTime) + ',' + connection.escape(3) + ',' + connection.escape(workout.workoutID) + ')').then(function (rows) {
                console.log(rows);

            });

        });


    });

module.exports = router;