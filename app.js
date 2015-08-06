/**
 * Created by david on 5/22/15.
 */

var express = require('express');
var morgan = require('morgan');
var path = require ('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var multer = require('multer');
var cloudinary = require('cloudinary');
var routes = require('./routes');
var mongoose = require('mongoose');
var morgan = require('morgan');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var app = express();

cloudinary.config({
    cloud_name: 'davidsoftbda',
    api_key: '735747433837115',
    secret_key: 'vm59m4wRPoithgOXOz0mj6hytjc'
});

//provide a sensible default for local development
var db_name = 'advc-db';
var connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
    connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect(connection_string);

app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine.
app.set('views', path.join(__dirname,'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(multer({dest: './public/uploads'}));

routes(app, mongoose);

// passport config
var Account = require('./models/user-model');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

var server_port = process.env.OPENSHIFT_NODEJS_PORT || '3000';
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

app.listen(server_port, server_ip_address, function () {
    console.log( "Listening on " + server_ip_address + ", server_port " + server_port )
});
