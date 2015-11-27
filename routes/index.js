var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');

var tokenManager = require('../config/token_manager');

var app = express();

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



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


//Register a users
router.route('/register')
    .post(function(req, res, next){
        if(req.body.password === req.body.passwordConfirmation){
            var email = req.body.email;
            var salt = setsalt();
            var hash = getHash(req.body.password,salt);


            console.log("hash: " + hash);
            pool.getConnection(function(err, connection) {
                connection.query('Insert into user (email,hash,salt,admin,google_user) VALUES (' + connection.escape(email) + ',' + connection.escape(hash) + ',' + connection.escape(salt) + ',true,false)', function (err, rows, fields) {
                    connection.release();
                    if (!err){
                        var token = jwt.sign(email, secret.secretToken, { expiresIn: tokenManager.TOKEN_EXPIRATION_SEC });
                        return res.json({token:token});
                    }
                    else{
                        console.log("shit")
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
                var token = jwt.sign(email, secret.secretToken, { expiresIn: tokenManager.TOKEN_EXPIRATION_SEC });

                return res.json({token:token});
            });
        });
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
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        });

    }
});

router.route('/user')
    // fetch all users
    .get(function (req, res, next) {

        var user = req.decoded;
        console.log(user);
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


app.use('/api', router);
module.exports = router;
