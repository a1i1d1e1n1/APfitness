var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');

//Sets the mysqlCredentails
var pool = mysql.createPool(secret.localSql);

var setsalt = function () {
    return crypto.randomBytes(16).toString('hex');
};

var getHash = function (password, salt) {
    return crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
};

var compareHash = function (storedHash, genHash) {
    return storedHash == genHash;
};

router.route('/publicworkout/:id')
    // fetch all Workouts_exercises
    .get(function (req, res) {

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

router.route('/publicexercise/:id')
    // fetch all Workouts_exercises
    .get(function (req, res) {

        var params = req.params;
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * FROM exercise where exerciseID = ' + params.id, function (err, rows, fields) {
                connection.release();
                if (!err)
                    res.json(rows);
                else
                    console.log('Error while performing Query.' + err);
            });
        })

    });

router.route('/passwordReset')
    .post(function (req, res) {

        var email = req.body.email;

        pool.getConnection(function (err, connection) {
            connection.query('SELECT * from User where email = "' + email + '"', function (err, row) {
                if (!err) {
                    if (row[0]) {
                        var tempPass = randomstring.generate({
                            length: 8,
                            charset: 'hex'
                        });

                        var hash = getHash(tempPass, row[0].salt);

                        connection.query('UPDATE User SET hash =' + connection.escape(hash) + ' WHERE email =' + connection.escape(email), function (err, row) {
                            if (!err) {
                                var transporter = nodemailer.createTransport(secret.smtpConfig);

                                var mailOptions = {
                                    from: 'APfitness@mail.com', // sender address
                                    to: email, // list of receivers
                                    subject: 'Password Reset', // Subject line
                                    html: '<p>Hi,</p><p>A new password has been generated:</p>' +
                                    '<h3>' + tempPass + '</h3>' +
                                    '<p>Please log into your account with this password and then change it once logged in.</p>' +
                                    '<p>Thanks</p>' // html body
                                };

                                transporter.sendMail(mailOptions, function (error, info) {
                                    transporter.close();
                                    if (error) {
                                        return console.log(error);
                                    }
                                    console.log('Message sent: ' + info.response);
                                    return res.json("Reset email has been sent to: " + email);
                                });
                            }

                        });


                    } else {
                        return res.status(400).send({
                            success: false,
                            message: "There is no account with that email :-("
                        });
                    }
                }
                else {
                    return res.status(400).send({
                        success: false,
                        message: err
                    });
                }
            });
        });

    });


//Register a users
router.route('/register')
    .post(function (req, res, next) {
        //Checks to see if the password and confirm password match
        if (req.body.password === req.body.passwordConfirmation) {
            //Gets the email from the request
            var email = req.body.email;

            //Gets a unique salt value
            var salt = setsalt();

            //Creates a hash based on the password and unique salt value
            var hash = getHash(req.body.password, salt);

            pool.getConnection(function (err, connection) {

                //Inserts the new user into the database.
                connection.query('Insert into user (email,hash,salt,admin,google_user) VALUES (' +
                    connection.escape(email) + ',' + connection.escape(hash) + ',' + connection.escape(salt) +
                    ',false,' + connection.escape(req.body.google_user) + ')', function (err, rows, fields) {

                    if (!err) {
                        var payload = {email: email, ID: rows.insertId, first_name: "New", last_name: "User"};
                        var token = jwt.sign(payload, secret.secretToken, {expiresIn: 3600});

                        //Creates a new unique json web token and passes it back to the client.
                        connection.query('Insert into profile (first_name,last_name,userID) VALUES (' +
                            connection.escape("New") + ',' + connection.escape("user") + ',' + connection.escape(rows.insertId) + ')'
                            , function (err, rows, fields) {
                            if (!err) {

                                return res.json({token: token});
                            }
                            else {
                                res.status(401);
                                return res.json({message: "Profile couldn't be created :?."});
                            }

                        });
                    }
                    else {

                        res.status(401);
                        return res.json({message: "That email already exists."});

                    }
                });
            });
        } else {
            return res.json("Passwords don't match");
        }
    });


router.route('/logout')
    .get(function (req, res) {

        return res.send(200);
    });


//login a user to the system.
router.route('/login')
    .post(function (req, res) {
        //Sets the email and password that is passed from the client.
        var email = req.body.email || '';
        var password = req.body.password || '';

        //checks to see if the email and password are valid.
        if (email == '' || password == '') {
            res.status(401);
            return res.json({message: 'Please enter a email or password'});
        }

        //Get connection to the database
        pool.getConnection(function (err, connection) {
            connection.query('SELECT * from user_profile where email = "' + email + '"', function (err, row) {
                connection.release();
                if (err) {
                    res.status(401);
                    return res.json({message: 'Error performing Query'});
                }
                //Check to see if the email exists in the system.
                if (!row[0]) {
                    res.status(401);
                    return res.json({message: 'Email or Password do not match'});
                }

                //Checks if the password is valid
                var valid = compareHash(row[0].hash, getHash(password, row[0].salt));

                if (!valid) {
                    res.status(401);
                    return res.json({message: 'Email or Password do not match'});
                }
                console.log("Password is correct " + email);

                //Assigns a user a token.
                var payload = {
                    email: email,
                    ID: row[0].userID,
                    first_name: row[0].first_name,
                    last_name: row[0].last_name
                };
                var token = jwt.sign(payload, secret.secretToken, {expiresIn: 3600});

                return res.json({token: token, admin: row[0].admin, google: row[0].google_user});
            });
        });
    });


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


    }
});


router.route('/auth')
    .get(function (req, res) {

        return res.send(req.decoded);
    });


module.exports = router;
