"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Division = new Schema({
    'name': {
        'type': String,
        'required': true
    },
    'category': {
        'type': String,
        'required': true
    }
});

var TeamSchema = new Schema({
    'name': {
       'type': String,
       'required': true
    },
    'division': {
        'type': [Division],
        'required': true
    },
    'branch': {
        'type': String,
        'index': true,
        'required': true,
        'default': "---------",
        'enum': [
            "---------",
            "Femenino",
            "Masculino"
        ]
    },
    'players': [
        {
            'type': mongoose.Schema.Types.ObjectId,
            'ref': 'Player'
        }
    ]
});

var TeamModel = mongoose.model('Team', TeamSchema);

module.exports = TeamModel;