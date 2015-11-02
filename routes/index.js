var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'maddog_1',
  database : 'sakila'
});



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/author', function(req, res, next) {



  connection.connect(function(err){
    if(!err) {
      console.log("Database is connected ... \n\n");
    } else {
      console.log("Error connecting database ... \n\n");
    }
  });


  connection.query('SELECT * from actor', function(err, rows, fields) {
    connection.end();
    if (!err)
      res.json(rows);
    else
      console.log('Error while performing Query.');
  });
});

module.exports = router;
