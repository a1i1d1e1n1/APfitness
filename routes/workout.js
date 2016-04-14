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

//Checks to see if an events clashes with another event
var checkConflicts = function (workout_to_check, workouts) {
    return new Promise(function (resolve, reject) {
        var conflict = false;
        for (var i = 0; i < workouts.length; i++) {
            if ((workout_to_check.start_time <= workouts[i].end_date) && (workout_to_check.end_time >= workouts[i].end_date)) {
                conflict = true;
                reject(workouts[i]);
            }
        }
        resolve(workout_to_check);
    });
};

var insertExercises = function (workoutID, exercise, connection) {
    return new Promise(function(resolve,reject){
        connection.query('Insert into workout_exercise (duration,workoutID,exerciseId) VALUES (' + connection.escape(30) + ',' +
            connection.escape(workoutID) + ',' + connection.escape(exercise.exerciseID) + ')', function (err, rows, fields) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
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
        } else {
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
                return res.status(401).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });

            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {

        // if there is no token
        // return an error
        return res.status(401).send({
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
            connection.query('SELECT * from workout_page', function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    console.log('Error while performing Query.');
            });
        })
    });

router.route('/recent')
    // fetch all Workouts
    .get(function (req, res, next) {

        var user = req.decoded;
        console.log(user);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * from workout_calander where userID =' + connection.escape(user.ID) + " ORDER BY start_date DESC Limit 10", function (err, rows, fields) {
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
    // Saves a workout
    .post(function (req, res, next) {

        var user = req.decoded;
        var workout = req.body.workout;
        var workoutID = 0;

        pool.getConnection().then(function (connection) {
            connection.query('Insert into workout (workoutName,description,rating,userID,private_workout) VALUES (' + connection.escape(workout.name) + ',' +
                connection.escape(workout.name) + ',' + connection.escape(0) + ',' + connection.escape(user.ID)
                + ',' + connection.escape(workout.private) + ')').then(function (rows) {
                workoutID = rows.insertId;

                for (var i = 0; i < workout.exercises.length; i++) {
                    var exercise = workout.exercises[i];

                    insertExercises(workoutID, exercise, connection).then(function(results){
                        for (var j = 0; j < results.sets.length; j++) {
                            insertSets(results.sets[j],results.insertedId,connection);
                        }
                    });

                }

                res.json("Workout saved");
            }).catch(function (err) {
                return res.status(400).send({
                    success: false,
                    message: err
                });
            });
        });


    });

router.route('/assign')
    // fetch all users
    .post(function (req, res, next) {

        var user = req.decoded;
        var workout = req.body.workout;
        workout.start_time = new Date(req.body.datetime);
        workout.end_time = new Date(req.body.datetime);
        workout.end_time.setHours(workout.end_time.getHours() + 1);

        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM workout_calander WHERE userID =' + connection.escape(user.ID), function (err, rows, fields) {
                if (!err) {
                    checkConflicts(workout, rows, connection).then(function (results) {

                        connection.query('Insert into assinged_workout (start_date,end_date,userID,workoutID) VALUES (' + connection.escape(workout.start_time) + ',' +
                            connection.escape(workout.end_time) + ',' + connection.escape(user.ID) + ',' + connection.escape(workout.workoutID) + ')', function (err, rows) {
                            if (!err) {
                                res.json("Workout Assinged");
                            } else {
                                return res.status(400).send({
                                    success: false,
                                    message: err
                                });
                            }


                        });

                    }).catch(function (error) {
                        //do something with the error and handle it
                        return res.status(400).send({
                            success: false,
                            message: "workout cant be assigned as it conflicts with" + error
                        });
                    });
                } else {
                    return res.status(400).send({
                        success: false,
                        message: err
                    });
                }
            });
        });
    });

router.route('/assigned')
    // fetch all Workouts_exercises
    .get(function (req, res, next) {

        var user = req.decoded;

        console.log(user);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM workout_calander WHERE userID =' + connection.escape(user.ID), function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    return res.status(402).send({
                        success: false,
                        message: err
                    });
            });
        })

    });

router.route('/comments/:id')
    // fetch all exercises
    .get(function (req, res, next) {

        var user = req.decoded;
        var params = req.params;
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * from workout_comments_details WHERE workoutID =' + connection.escape(params.id), function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    return res.json(err);
            });
        })
    });

router.route('/comment/save')
    // Save a comment to the database
    .post(function (req, res, next) {

        var user = req.decoded;

        var comment = req.body.comment;

        pool.getConnection(function (err, connection) {
            connection.query('INSERT INTO workout_comments (description, workoutID, userID,rating) VALUES (' + connection.escape(comment.desc) + ',' +
                connection.escape(comment.workoutID) + ',' + connection.escape(user.ID) + ',' + connection.escape(comment.rate) +
                ')', function (err, rows, fields) {
                connection.release();
                if (!err)
                    return res.status(200).send({
                        success: true,
                        message: "Comment Added"
                    });
                else
                    return res.status(400).send({
                        success: false,
                        message: err
                    });
            });
        })
    });

router.route('/comment/delete')
    // fetch all exercises
    .post(function (req, res, next) {

        var user = req.decoded;

        var comment = req.body.comment;

        if (comment.userID == user.ID) {
            pool.getConnection(function (err, connection) {
                connection.query('DELETE FROM workout_comments WHERE w_commentID = ' + connection.escape(comment.commentID), function (err, rows, fields) {
                    connection.release();
                    if (!err)
                        return res.status(200).send({
                            success: true,
                            message: "Comment Deleted"
                        });
                    else
                        return res.status(400).send({
                            success: false,
                            message: err
                        });
                });
            })
        } else {
            return res.status(400).send({
                success: false,
                message: "That is not your comment to delete!"
            });
        }


    });
module.exports = router;