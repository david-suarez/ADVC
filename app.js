/**
 * Created by david on 5/22/15.
 */

var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes');
var mongoose = require('mongoose');

var app = express();

mongoose.connect('mongodb://localhost/advc-db');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': true}));

routes(app, mongoose);

var port = process.env.PORT || '3000';

app.listen(port);

console.log('EL servidor esta corriendo en el puerto ' + port);