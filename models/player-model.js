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
    'cityOfBirth': {
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
        'default': ""
    },
    'dateOfBirth': {
        'type': Date,
        'default': "",
        'required': true
    },
    'bookBirthCert':{
        'type': String,
        'default': ""
    },
    'departureBirthCert':{
        'type': String,
        'default': ""
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
    'image': {
        'type': String,
        'default': ""
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
        'default': ""
    },
    'team': [
        {
            'type': mongoose.Schema.Types.ObjectId,
            'ref': 'Team'
        }
    ],
    'cvPlayer':{
        "type": [CvSchema]
    },
    'club': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Club'
    },
    'status': {
        'type': String,
        'index': true,
        'default': "No habilitado",
        'enum': [
            "No habilitado",
            "Habilitado",
            "Libre"
        ]
    },
    'majorCategory': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Team'
    },
    'asoOrigin': {
        'type': String,
        'required': true
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
