var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var crypto = require('crypto');

var pool  = mysql.createPool({
  connectionLimit : 10,
  host     : 'localhost',
  user     : 'root',
  password : 'maddog_1',
  database : 'ApFitness'
});

var setsalt = function(){
  salt = crypto.randomBytes(16).toString('hex');

  return salt ;
};

var getHash = function(password,salt){
  var hash = crypto.pbkdf2Sync(password, salt, 1000, 64).toString('hex');

  return hash ;
};

var compareHash = function(storedHash,genHash){
  return storedHash == genHash;
};

router.route('/user')

    // fetch all users
    .get(function (req, res) {
      pool.getConnection(function(err, connection) {
        connection.query('SELECT * from User', function(err, rows, fields) {
          connection.release();
          if (!err)
            res.json(rows);
          else
            console.log('Error while performing Query.');
        });
      })
    })

    // create a user
    .post(function (req, res) {
      pool.getConnection(function(err, connection) {
          // Use the connection
        connection.query('INSERT INTO USER', function(err, rows, fields) {
          connection.release();
          if (!err)
            res.json(rows);
          else
            console.log('Error while performing Query.');
        });
      });
    });


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Register a users
router.route('/register')
  .post(function(req, res, next){

    var email = req.body.email;
    var salt = setsalt();
    var hash = getHash(req.body.password,salt);

    console.log("hash: " + hash);
    pool.getConnection(function(err, connection) {
      connection.query('Insert into user (email,hash,salt,admin,google_user) VALUES (' + connection.escape(email) + ',' + connection.escape(hash) + ',' + connection.escape(salt) + ',true,false)', function (err, rows, fields) {
        connection.release();
        if (!err)
          console.log("YEAH BITCH IT WORKED");
        else
          console.log("shit")
          return next(err);
      });
    });

  });

router.route('/login')
    .post(function (req, res) {
      pool.getConnection(function(err, connection) {
        console.log(req.body.email);
        connection.query('SELECT * from User where email = "' + req.body.email +'"', function(err, row) {
          connection.release();
          if (err) {
            console.log('Error while performing Query.');
          } else {
            console.log(row);
            var valid = compareHash(row[0].hash,getHash(req.body.password, row[0].salt) );

            if(valid) {
              console.log("Logged in :)");
            }else{
              console.log('Not valid password');
            }
          }
        });
      });
    });

module.exports = router;
