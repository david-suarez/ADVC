"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MedicalRecordSchema = new Schema({

    'player': {
    'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Player'
    },
    'age':{
    'type': Number,
        'default': "",
        'required': true
    },
    'weight':{
        'type': Number,
        'default': "",
        'required': true
    },
    'height':{
        'type': Number,
        'default': "",
        'required': true
    },
    'home':{
        'type': String,
        'default': "",
        'required': true
    },
    'allergies':{
        'type': String,
        'default': ""
    },
    'operations':{
        'type': String,
        'default': ""
    }
});

var MedicalRecordModel = mongoose.model('MedicalRecord', MedicalRecordSchema);
module.exports = MedicalRecordModel;
