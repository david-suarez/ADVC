/**
 * Created by Baby_Moico on 25/05/2015.
 */
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClubSchema = new Schema({
    'name':{
        'type': String,
        'default': ""
    },
    'foundation':{
        'type':Date,
        'default':""
    },
    'delegate':{
        'type':String,
        'default':""
    }
});

var ClubModel = mongoose.model('Club', ClubSchema);
module.exports = ClubModel
