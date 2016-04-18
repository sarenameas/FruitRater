var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var app = express();
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

// create a default connection string
var connectionString = 'mongodb://127.0.0.1:27017/fruitRater';

// use remote connection string
// if running in remote server
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
    connectionString = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

// connect to the database
var db = mongoose.connect(connectionString);
mongoose.Promise = require('q').Promise;

// Parse request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport and session initialization
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());


app.use(express.static(__dirname + '/public'));

app.listen(port, ipaddress);




require ('./app/app.js')(app, db, mongoose);