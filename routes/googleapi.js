/**
 * Created by aiden on 03/01/2016.
 */

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var secret = require('../config/secret');
var google = require('googleapis-plus');
var fs = require('fs');
var readline = require('readline');
var googleAuth = require('google-auth-library');


var SCOPES = ['https://www.googleapis.com/auth/calendar'];
var TOKEN_DIR = './config/';
var TOKEN_PATH = TOKEN_DIR + 'token.json';


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function (code) {
        rl.close();
        oauth2Client.getToken(code, function (err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
    var calendar = google.calendar('v3');
    calendar.events.list({
        auth: auth,
        calendarId: 'primary',
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime'
    }, function (err, response) {
        if (err) {
            console.log('The API returned an error: ' + err);
            return;
        }
        var events = response.items;
        if (events.length == 0) {
            console.log('No upcoming events found.');
        } else {
            console.log('Upcoming 10 events:');
            for (var i = 0; i < events.length; i++) {
                var event = events[i];
                var start = event.start.dateTime || event.start.date;
                console.log('%s - %s', start, event.summary);
            }
        }
    });
}


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
                fs.readFile('./config/client_secret_845494265719-7a6t8i8ulbmfpdl05utiblba6oc67vtu.apps.googleusercontent.com.json', function processClientSecrets(err, content) {
                    if (err) {
                        console.log('Error loading client secret file: ' + err);
                        return;
                    }
                    // Authorize a client with the loaded credentials, then call the
                    // Google Calendar API.
                    authorize(JSON.parse(content), listEvents);
                });

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


    });


module.exports = router;