/**
 * Created by david on 5/22/15.
 */

var express = require('express');
var morgan = require('morgan');
var path = require ('path');
var bodyParser = require('body-parser');
var multer = require('multer');
var cloudinary = require('cloudinary');
var routes = require('./routes');
var mongoose = require('mongoose');
var morgan = require('morgan');

var app = express();

cloudinary.config({
    cloud_name: 'davidsoftbda',
    api_key: '735747433837115',
    secret_key: 'vm59m4wRPoithgOXOz0mj6hytjc'
})

mongoose.connect('mongodb://localhost/advc-db');

app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine.
app.set('views', path.join(__dirname,'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');

app.use(morgan('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

app.use(multer({dest: './public/uploads'}));

routes(app, mongoose);

var port = process.env.PORT || '3000';

app.listen(port);

console.log('EL servidor esta corriendo en el puerto ' + port);