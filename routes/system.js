var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport();

var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'maddog_1',
  database : 'ApFitness'
});

var setsalt = function(){
  return crypto.randomBytes(16).toString('hex');
};

var getHash = function(password,salt){
  return crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');
};

var compareHash = function(storedHash,genHash){
  return storedHash == genHash;
};


router.route('/passwordReset')
    .post(function(req, res){

        var email = req.body.email;
        console.log(req.body);
        pool.getConnection(function(err, connection) {
            console.log(email);
            //Inserts the new user into the database.
            connection.query('SELECT * from User where email = "' + email +'"', function(err, row) {

                //Returns connection to the pool
                connection.release();

                if (!err){
                    if(row[0]){
                        var code = '1234r';
                        transporter.sendMail({
                            from: 'APfitness@mail.com',
                            to: email,
                            subject: 'Password Reset',
                            html: '<p>Hi,</p><p>To reset your password enter the following code on the password reset screen:</p>' +
                            '<h3><var>code</var></h3>' +
                            '<p>Thanks</p>' // html body
                        });
                        return res.json("Reset email has been sent to: " + email);
                    }else{
                        return res.json("There is no account with that email :-(");
                    }
                }
                else{
                    return next(err);
                }
            });
        });

    });


//Register a users
router.route('/register')
    .post(function(req, res, next){
        //Checks to see if the password and confirm password ma
        if(req.body.password === req.body.passwordConfirmation){
            //Gets the email from the request
            var email = req.body.email;

            //Gets a unique salt value
            var salt = setsalt();

            //Creates a hash based on the password and unique salt value
            var hash = getHash(req.body.password,salt);

            pool.getConnection(function(err, connection) {

                //Inserts the new user into the database.
                connection.query('Insert into user (email,hash,salt,admin,google_user) VALUES (' + connection.escape(email) + ',' + connection.escape(hash) + ',' + connection.escape(salt) + ',true,false)', function (err, rows, fields) {

                    //Returns connection to the pool
                    connection.release();

                    if (!err){
                        //Creates a new unique json web token and passes it back to the client.
                        var token = jwt.sign(email, secret.secretToken, { expiresIn: 3600 });
                        return res.json({token:token});
                    }
                    else{
                        return next(err);
                    }
                });
            });
        }
    });

router.route('/logout')
    .get(function(req, res){

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
            return res.send('Please enter a email or password');
        }

        console.log(email +"  "+ password);

        //Get connection to the database
        pool.getConnection(function(err, connection) {
            connection.query('SELECT * from User where email = "' + email +'"', function(err, row) {
                connection.release();
                if (err) {
                    console.log('Error while performing Query.');
                    return res.sendStatus(401);
                }
                //Check to see if the email exists in the system.
                if(!row[0]){
                    console.log("Attempt failed to login with " + email);
                    return res.sendStatus(401);
                }

                //Checks if the password is valid
                var valid =  compareHash(row[0].hash,getHash(password, row[0].salt));

                if(!valid){
                    console.log("Password is incorrect " + email);
                    return res.sendStatus(401);
                }
                console.log("Password is correct " + email);

                //Assigns a user a token.
                var token = jwt.sign(email, secret.secretToken, { expiresIn: 3600 });

                return res.json({token:token,admin:row[0].admin});
            });
        });
    });

module.exports = router;
