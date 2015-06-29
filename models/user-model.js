"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    'user_name' : {
        'type': String,
        'default':""
    },
    'name': {
        'type': String,
        'default': "",
        'required': true
    },
    'lastname':{
        'type': String,
        'default': "",
        'required': true
    },
    'password': {
        'type': String,
        'default': "",
        'required': true
    },
    'admin': Boolean
});

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;