"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

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

    'role': {
        'type': String,
        'index': true,
        'required': false,
        'default': "Delegate",
        'enum': [
            "Super Admin",
            "Admin Staff",
            "Staff",
            "Delegate"
        ]
    },
    'club': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Club'
    }
});

UserSchema.plugin(passportLocalMongoose);

var UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;