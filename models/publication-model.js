"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PublicationSchema = new Schema({
    'title':{
        'type': String,
        'default': "",
        'required': true
    },
    'description':{
        'type': String,
        'default': "",
        'required': true
    },
    'type':{
        'type': String,
        'index': true,
        'required': true,
        'default': "main",
        'enum': [
            "main",
            "secondary"
        ]
    },
    'reference':{
        'type': String,
        'default': ""
    },
    'fileName':{
        'type': String,
        'default': ""
    },
    'file':{
        'type': String,
        'default': ""
    },
    'date':{
        'type': Date,
        'default': new Date()
    }
});

var PublicationsModel = mongoose.model('Publication', PublicationSchema);
module.exports = PublicationsModel;

