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
        'enum': [
            "main",
            "secondary"
        ]
    },
    'reference':{
        'type': String,
        'default':""
    },
    'file':{
        'type':String,
        'default':""
    }
});

var PublicationsModel = mongoose.model('Publication', PublicationSchema);
module.exports = PublicationsModel;

