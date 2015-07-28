"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var CvSchema = new Schema({
    "year": {
        "type":Number,
        "default":""
    },
    "clubName":{
        "type":String,
        "default":""
    },
    "association":{
        "type":String,
        "default":""
    },
    "category":{
        "type":String,
        "default":""
    },
    "sede":{
        "type":String,
        "default":""
    },
    "type":{
        'type': String,
        'index': true,
        'required': true,
        'default': "Club",
        'enum': [
            "Club",
            "Selección Departamental",
            "Selección Nacional"
        ]
    }
});

var PlayerSchema = new Schema({
    'name': {
        'type': String,
        'default': "",
        'required': true
    },
    'lastname': {
        'type': String,
        'default': "",
        'required': true
    },
    'city_of_birth': {
        'type': String,
        'default': "",
        'required': true
    },
    'nationality': {
        'type': String,
        'default': "",
        'required': true
    },
    'ci': {
        'type': String,
        'default': "",
        'required': true
    },
    'dateOfBirth': {
        'type': Date,
        'default': "",
        'required': true
    },
    'phoneNumber': {
        'type': Number,
        'default': ""
    },
    'address': {
        'type': String,
        'default': ""
    },
    'zone': {
        'type': String,
        'default': ""
    },
    'postcode': {
        'type': String,
        'default': ""
    },
    'officeBirthCert':{
        'type': String,
        'default': "",
        'required': true
    },
    'bookBirthCert':{
        'type': String,
        'default': "",
        'required': true
    },
    'departureBirthCert':{
        'type': String,
        'default': "",
        'required': true
    },
    'departureDateBirthCert':{
        'type': Date,
        'default': "",
        'required': true
    },
    'branch': {
        'type': String,
        'index': true,
        'required': true,
        'enum': [
            "Femenino",
            "Masculino"
        ]
    },
    'club':{
        'type':String,
        "required":true
    },
    'cvPlayer':{
        "type":[CvSchema],
        "default":""
    }
});

PlayerSchema.methods.changeClub = function(clubId) {
    var deferred;
    deferred = Q.defer();
    this.club = clubId;
    this.save(function(error, player) {
        if (error) {
            return deferred.reject(error);
        } else {
            return deferred.resolve(player);
        }
    });
    return deferred.promise;
};

var PlayerModel = mongoose.model('Player', PlayerSchema);
module.exports = PlayerModel;
