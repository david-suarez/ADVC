/**
 * Created by david on 5/22/15.
 */

var express = require('express');
var morgan = require('morgan');
var path = require ('path');
var bodyParser = require('body-parser');
var routes = require('./routes');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/advc-db');

app.use(express.static(path.join(__dirname, 'public')));

// Set View Engine.
app.set('views', path.join(__dirname,'views'));
app.engine('.html', require('ejs').__express);
app.set('view engine', 'html');


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

routes(app, mongoose);

var port = process.env.PORT || '3000';

app.listen(port);

console.log('EL servidor esta corriendo en el puerto ' + port);