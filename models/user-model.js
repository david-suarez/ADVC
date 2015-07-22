"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new Schema({
    'username' : {
        'type': String,
        'unique': true,
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
    'fullname':{
        'type': String,
        'default': ""
    },
    'password': {
        'type': String
    },
    'role': {
        'type': String,
        'index': true,
        'default': "Delegado",
        'enum': [
            "Super Admin",
            "Administrador",
            "Personal Apoyo",
            "Delegado",
            "Comision Medica"
        ]
    }
});

UserSchema.plugin(passportLocalMongoose);

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;