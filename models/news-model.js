"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NewsSchema = new Schema({
    'description':{
        'type': String,
        'default': ""
    },
    'category':{
        'type':Date,
        'default':""
    },
    'image':{
        'type':String,
        'default':""
    },
    'file':{
        'type':String,
        'default':""
    }
});

var NewsModel = mongoose.model('Club', NewsSchema);
module.exports = NewsModel;

