/**
 * Created by Baby_Moico on 25/05/2015.
 */
"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClubSchema = new Schema({
    'name':{
        'type': String,
        'default': "",
        'required': true
    },
    'foundation':{
        'type':Date,
        'default':""
    },
    'delegate': {
            'type': mongoose.Schema.Types.ObjectId,
            'ref': 'User'
        },
    'teams': [
        {
            'type': mongoose.Schema.Types.ObjectId,
            'ref': 'Team'
        }
    ]
});

var ClubModel = mongoose.model('Club', ClubSchema);
module.exports = ClubModel;
