/**
 * Created by nm on 12/16/2015.
 */

var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'l3855uft9zao23e2.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    user: 'y9bbg4eovsunfldv',
    password: 'n3fg5jelhe20abhm',
    database: 'osf9zjz6on7aapqd'
});

// route middleware to verify a token
router.use(function(req, res, next) {

    console.log(req.headers.authorization);
    // check header or url parameters or post parameters for token
    var token = req.headers.authorization;

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, secret.secretToken, function(err, decoded) {
            if (err) {

                return res.status(401).send({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
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
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

router.route('/')
    // fetch all exercises
    .get(function (req, res, next) {

        var user = req.decoded;
        pool.getConnection(function(err, connection) {
            connection.query('SELECT * from exercise_page', function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    return res.json(err);
            });
        })
    });

router.route('/comments/:id')
    // fetch all exercises
    .get(function (req, res, next) {

        var user = req.decoded;
        var params = req.params;
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * from exercise_comments_details WHERE exerciseID =' + connection.escape(params.id), function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    return res.json(err);
            });
        })
    });

router.route('/comment/save')
    // fetch all exercises
    .post(function (req, res, next) {

        var user = req.decoded;

        var comment = req.body.comment;

        pool.getConnection(function (err, connection) {
            connection.query('INSERT INTO exercise_comments (description, exerciseID, userID) VALUES (' + connection.escape(comment.desc) + ',' + connection.escape(comment.exerciseID) + ',' + connection.escape(user.ID) + ')', function (err, rows, fields) {
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

module.exports = router;