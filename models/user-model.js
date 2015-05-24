"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    'name': {
        'type': String,
        'default': ""
    },
    'lastname':{
        'type': String,
        'default': ""
    },
    'password': {
        'type': String,
        'default': ""
    },
    'admin': Boolean
});

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;