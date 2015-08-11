"use strict";
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var TeamSchema = new Schema({
    name: {
       type: String,
       required: true
    },
    branch: {
        type: String,
        index: true,
        required: true,
        enum: [
            "Femenino",
            "Masculino"
        ]
    },
    division: {
        type: String,
        required: true,
        enum: [
            "Pre Mini",
            "Mini",
            "Infantil",
            "Cadetes",
            "Juvenil",
            "Sub-23",
            "Tercera Ascenso",
            "Segunda Ascenso",
            "Primera Ascenso",
            "Primera Honor",
            "Maxi Voleibol"
        ]
    },
    category: {
        type: String,
        required: true,
        enum: [
            "Mayores",
            "Menores"
        ]
    },
    club: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true
    },
    players: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player'
        }
    ],
    championship:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Championship'
        },
    sequence: {
        type: Number,
        default: 0
    }
});

TeamSchema.pre('save', function(next){
    var self = this;
    if(self.category) {
        if(self.category.toLowerCase() === 'mayores') {
            _validateMajorTeam(self)
                .then(function () {
                    switch (self.division) {
                        case 'Primera Honor':
                            self.sequence = 1;
                            break;
                        case 'Primera Ascenso':
                            self.sequence = 2;
                            break;
                        case 'Segunda Ascenso':
                            self.sequence = 3;
                            break;
                        case 'Tercera Ascenso':
                            self.sequence = 4;
                            break;
                    }
                    return next();
                })
                .fail(function (error) {
                    return next(error);
                });
        } else if(this.category.toLowerCase() === 'menores'){
            _validateMinorTeam(self)
                .then(function () {
                    switch (self.division) {
                        case 'Pre Mini':
                            self.sequence = 5;
                            break;
                        case 'Mini':
                            self.sequence = 6;
                            break;
                        case 'Infantil':
                            self.sequence = 7;
                            break;
                        case 'Cadete':
                            self.sequence = 8;
                            break;
                        case 'Juvenil':
                            self.sequence = 9;
                            break;
                        case 'Sub-23':
                            self.sequence = 10;
                            break;
                    }
                    return next();
                })
                .fail(function (error) {
                    return next(error);
                });
        }
    }
});

var TeamModel = mongoose.model('Team', TeamSchema);

var _validateMajorTeam = function(team){
    var deferred = Q.defer();
    var clubId = team.club;
    var division = team.division;
    var branch = team.branch;

    var filter = {
        club: clubId,
        division: division,
        branch: branch,
        category: "Mayores"
    };
    TeamModel.find(filter).exec(function(error, teams) {
        var duplicateError;
        if(error){
            deferred.reject(error);
        } else if(teams.length) {
            if(team._id.equals(teams[0]._id)){
                deferred.resolve(true);
            } else {
                duplicateError = new Error('duplicate team');
                duplicateError.code = 409;
                deferred.reject(duplicateError);
            }
        } else{
            deferred.resolve(true);
        }
    });
    return deferred.promise;
};

var _validateMinorTeam = function(team){
    var deferred = Q.defer();
    var clubId = team.club;
    var division = team.division;
    var branch = team.branch;
    var name = team.name;
    var champId = team.championship;
    var filter = {
        "club": clubId,
        "name": name,
        "division": division,
        "branch": branch,
        "championship": champId,
        category: "Menores"
    };
    TeamModel.find(filter).exec(function(error, teams) {
        var duplicateError;
        if(error){
            deferred.reject(error);
        } else if(teams.length) {
            duplicateError = new Error('duplicate team');
            duplicateError.code = 409;
            deferred.reject(duplicateError);
        } else{
            deferred.resolve(true);
        }
    });
    return deferred.promise;
};

module.exports = TeamModel;