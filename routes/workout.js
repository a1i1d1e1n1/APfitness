/**
 * Created by aiden on 03/01/2016.
 */
var express = require('express');
var router = express.Router();
var mysql = require('promise-mysql');
var Promise = require("bluebird");
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var schedule = require('node-schedule');
var nodemailer = require('nodemailer');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'maddog_1',
    database: 'ApFitness'
});

var rule = new schedule.RecurrenceRule();

rule.minute = new schedule.Range(0, 59, 15);

schedule.scheduleJob(rule, function () {
    console.log(rule);

    pool.getConnection(function (err, connection) {
        connection.query('SELECT * FROM assinged_workout WHERE start_date  < DATE_ADD(NOW(), INTERVAL 1 HOUR) AND start_date >= NOW() AND email_sent = 0 ORDER BY start_date', function (err, rows, fields) {
            connection.release();
            if (!err) {
                for (var i = 0; i < rows.length; i++) {
                    sendMail(rows[i]);
                    setSent(rows[i]);
                }
                if (rows.length == 0) {
                    console.log('No workouts to send');
                }
            }
            else {
                console.log('Error while performing Query.');
            }
        });
    })
});

var setSent = function (workout) {
    pool.getConnection(function (err, connection) {
        connection.query('UPDATE assinged_workout SET email_sent = 1 WHERE workoutID = ' + workout.workoutID, function (err, rows, fields) {
            connection.release();
            if (!err) {
                console.log('workout has set sent email');
            }
            else {
                console.log('Error while performing set sent_email.');
            }
        });
    })
};

var sendMail = function (workout) {
    var transporter = nodemailer.createTransport(secret.smtpConfig);

    var mailOptions = {
        from: 'APfitness@mail.com', // sender address
        to: 'a1i1d1e1n1@googlemail.com', // list of receivers
        subject: 'Upcoming Workout', // Subject line
        html: '<p>Hi,</p><p>You have an upcoming workout in the next hour:</p>' +
        '<p>Please follow the link to view the workout.</p>' +
        'http://192.168.1.93:3000/#/workouts/' + workout.workoutID +
        '<p>Thanks</p>' // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        transporter.close();
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: ' + info.response);

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
        connection.query('Insert into workout_exercise (duration,workoutID,exerciseId,reps,sets) VALUES (' + connection.escape(30) + ',' +
            connection.escape(workoutID) + ',' + connection.escape(exercise.exerciseID) + ',' + connection.escape(exercise.reps) + ',' + connection.escape(exercise.sets) + ')', function (err, rows, fields) {
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


// route middleware to verify a token
router.use(function (req, res, next) {

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
            connection.query('SELECT * from workout_page WHERE private_workout = 1 AND userID = ' + user.ID + ' OR private_workout = 0 ORDER BY workoutID desc', function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    console.log('Error while performing Query.');
            });
        })
    });

router.route('/weekly')
    // fetch all Workouts
    .get(function (req, res, next) {

        var user = req.decoded;
        console.log(user);
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM workout_calander where userID =' + connection.escape(user.ID) + ' AND start_date > DATE_SUB(NOW(), INTERVAL 1 DAY) ORDER BY start_date', function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    console.log('Error while performing Query.');
            });
        })
    });

router.route('/complete')
    // fetch all Workouts
    .post(function (req, res, next) {

        var user = req.decoded;
        var workout = req.body.workout;
        console.log(user);
        pool.getConnection(function (err, connection) {
            connection.query('Update assinged_workout SET completed = 1 Where assinged_workout_id = ' + connection.escape(workout.assinged_workout_id), function (err, rows, fields) {
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
router.route('/WorkoutExercises/:id')
    // fetch all Workouts_exercises
    .get(function (req, res, next) {

        var user = req.decoded;

        var params = req.params;
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM workout_exercises where workoutID = ' + params.id, function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    console.log('Error while performing Query.' + err);
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

                        connection.query('Insert into assinged_workout (start_date,end_date,userID,workoutID,email_sent) VALUES (' + connection.escape(workout.start_time) + ',' +
                            connection.escape(workout.end_time) + ',' + connection.escape(user.ID) + ',' + connection.escape(workout.workoutID) + ',0)', function (err, rows) {
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
                            message: "workout cant be assigned as it conflicts with " + error.workoutName
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
            connection.query('SELECT * from workout_comments_details WHERE workoutID =' + connection.escape(params.id) + 'ORDER BY date_created desc', function (err, rows, fields) {
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