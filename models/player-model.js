"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var CvSchema = new Schema({
    "year": {
        "type":Number,
        "default":""
    },
    "club_name":{
        "type":String,
        "default":""
    },
    "asociation":{
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
            "Seleccion",
            "Seleccion Nacional"
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
    'date_of_birth': {
        'type': Date,
        'default': "",
        'required': true
    },
    'phone_number': {
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
    'ofice_birth_cert':{
        'type': String,
        'default': "",
        'required': true
    },
    'book_birth_cert':{
        'type': String,
        'default': "",
        'required': true
    },
    'departure_birth_cert':{
        'type': String,
        'default': "",
        'required': true
    },
    'departure_date_birth_cert':{
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
    'cv_player':{
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
