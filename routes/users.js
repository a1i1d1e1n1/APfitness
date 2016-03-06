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

    console.log("Token received: " + req.headers.authorization);
  // check header or url parameters or post parameters for token
  var token = req.headers.authorization;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, secret.secretToken, function(err, decoded) {
      if (err) {

          return res.status(401).send({
              success: false,
              message: 'Token has expired or not valid.'
          });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
          console.log("User: ");
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
      pool.getConnection(function(err, connection) {
        connection.query('SELECT * from User WHERE email ="' + user + '"', function(err, rows, fields) {
          connection.release();
          if (!err)
            res.json(rows);
          else
            console.log('Error while performing Query.');
        });
      })
    });

router.route('/profile')
    // fetch all users
    .get(function (req, res, next) {

        var user = req.decoded;

        pool.getConnection(function (err, connection) {
            connection.query('SELECT * from profile WHERE userID ="' + user.ID + '"', function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    console.log('Error while performing Query.');
            });
        })
    });

router.route('/checkAdmin')
    // fetch all users
    .get(function (req, res, next) {

        var email = req.decoded.email;

      pool.getConnection(function(err, connection) {
        connection.query('SELECT * from User WHERE email ="' + email + '"', function(err, rows) {
          connection.release();
          if (!err)
            res.json(rows[0].admin);
          else
            console.log('Error while performing Query.');
        });
      })
    });

module.exports = router;
