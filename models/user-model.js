"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
var Q = require('q');
var ClubModel = require('./club-model');

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
            "Directivo",
            "Comisión Técnica",
            "Delegado",
            "Comisión Médica"
        ]
    }
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.pre('save', function(next){
    var self = this;
    if(self._id){
        _validateChangeRole(self)
            .then(function(isValid) {
                if(isValid)
                return next();
            })
            .fail(function(error){
                return next(error);
            });
    }
});


var UserModel = mongoose.model('User', UserSchema);
var _validateChangeRole = function(user){
    var deferred = Q.defer();
    var userId = user._id;
    UserModel.findById(userId, function(err, userData) {
        if(err){
            deferred.reject(err);
        } else {
            if(userData.role === 'Delegado'){
               ClubModel.find({delegate: userData._id}, function(error, club){
                   if(error){
                       deferred.reject(err);
                   } else{
                       if(club && userData.role !== user.role){
                           var errorUser = new Error('User associated to a ' +
                               'club as Delegate');
                           errorUser.code = 403;
                           deferred.reject(errorUser);
                       } else {
                           deferred.resolve(true);
                       }
                   }
               })
            } else {
                deferred.resolve(true);
            }
        }
    });
    return deferred.promise;
};

module.exports = UserModel;