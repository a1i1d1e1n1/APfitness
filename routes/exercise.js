/**
 * Created by nm on 12/16/2015.
 */

var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

var pool  = mysql.createPool({
    connectionLimit : 10,
    host     : 'localhost',
    user     : 'root',
    password : 'maddog_1',
    database : 'ApFitness'
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

                return res.json({ success: false, message: 'Failed to authenticate token.' });
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
    // fetch all users
    .get(function (req, res, next) {

        var user = req.decoded;
        console.log(user);
        pool.getConnection(function(err, connection) {
            connection.query('SELECT * from exercise', function(err, rows, fields) {
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


module.exports = router;