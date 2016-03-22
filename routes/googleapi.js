/**
 * Created by aiden on 03/01/2016.
 */

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var google = require('googleapis');
var calendar = google.calendar('v3');
var OAuth2 = google.auth.OAuth2;


var oauth2Client = new OAuth2('845494265719-7a6t8i8ulbmfpdl05utiblba6oc67vtu.apps.googleusercontent.com', 'rSRRhqErBIlokPmcot_rc6qs', 'http://localhost:3000/googleapi/oauth2callback');

google.options({auth: oauth2Client});

router.get('/auth', function (req, res) {
    //generater a url that asks permissions for Webmaster Tools
    var scopes = [
        'https://www.googleapis.com/auth/calendar'
    ];

    var url = oauth2Client.generateAuthUrl({
        access_type: 'online',
        scope: scopes
    });
    res.redirect(url);
});

router.get('/oauth2callback', function (req, res) {
    var code = req.query.code;

    oauth2Client.getToken(code, function (err, tokens) {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            oauth2Client.setCredentials(tokens);
        }
    });

    return res.status(200).send({
        success: true,
        message: "Logged into Google"
    });
});


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
                // Load client secrets from a local file.


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

router.route('/events')
    // fetch all Workouts
    .get(function (req, res, next) {
        calendar.events.list({calendarId: 'primary', auth: oauth2Client}, function (err, response) {
            // handle err and response
            var a = response;
            res.json(a);
        });

    });


module.exports = router;