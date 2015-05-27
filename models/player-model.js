"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PlayerSchema = new Schema({
    'name': {
        'type': String,
        'default': "",
        'required': true
    },
    'lastname': {
        'type': String,
        'default': "",
        'required': true
    },
    'ci': {
        'type': String,
        'default': "",
        'required': true
    },
    'date_of_birth': {
        'type': Date,
        'default': "",
        'required': true
    },
    'phone_number': {
        'type': Number,
        'default': ""
    },
    'address': {
        'type': String,
        'default': ""
    },
    'club':{
        'type': String,
        'default': "",
        'required': true
    }
});

var PlayerModel = mongoose.model('Player', PlayerSchema);
module.exports = PlayerModel;
