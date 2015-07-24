"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ChampionshipSchema = new Schema({
    'name':{
        'type': String,
        'default': "",
        'required': true
    },
    'initial_date':{
        'type':Date,
        'default':""
    },
    'final_date':{
        'type':Date,
        'default':""
    },
    'initial_inscription_date':{
        'type':Date,
        'default':""
    },
    'final_inscription_date':{
        'type':Date,
        'default':""
    }
});

var ChampionshipModel = mongoose.model('Championship', ChampionshipSchema);
module.exports = ChampionshipModel;