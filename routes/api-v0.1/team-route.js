var route = require('./routes');
var TeamModel = require('../../models/team-model');
var Q = require('q');

var __bind = function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var TeamRoute = (function(){
    function TeamRoute(){
        this.getTeam = __bind(this.getTeam, this);
        this.getTeams = __bind(this.getTeams, this);
        this.saveTeam = __bind(this.saveTeam, this);
        this.removeTeam = __bind(this.removeTeam, this);
        this.updateTeam = __bind(this.updateTeam, this);
    }

    TeamRoute.prototype.getTeam = function(request, response) {
        var team_id = request.params.team_id;
        TeamModel.findById(team_id, function(error, data) {
            if(error){
                response.json('500', error.message);
            }
            else{
                response.json('200', data);
            }
        });
    };

    TeamRoute.prototype.getTeams = function(request, response) {
        var filter = request.body;
        var query = TeamModel.find(filter);
        query.exec(function(error, data) {
            if (error) {
                response.json('500', error.message);
            } else {
                response.json('200', data);
            }
        });
    };

    TeamRoute.prototype.saveTeam = function(request, response) {
        var newTeam;
        newTeam = request.body.team;
        if(newTeam !== undefined) {
             TeamModel.create(newTeam, function (error, data) {
                if (error) {
                    response.json('500', error.message);
                } else {
                    response.json('200', data);
                }
            });
        } else {
            response.json('400', {'message': 'Bad Request'});
        }
    };

    TeamRoute.prototype.removeTeam = function(request, response) {
        var team_id = request.params.team_id;
        TeamModel.remove({_id: team_id}, function(err, doc){
            if (err){
                response.json(500, err.message);
            } else {
                response.json(200, doc);
            }
        });
    };

    TeamRoute.prototype.updateTeam = function(request, response) {
        var team_id = request.params.team_id;
        var newDataTeam = request.body.newDataTeam;
        if(team_id !== undefined && newDataTeam !== undefined) {
             TeamModel.findById(team_id, function(error, team) {
                if(error){
                    response.json('500', error.message);
                }
                else{
                    for (var key in newDataTeam) {
                        console.log(key);
                        if(team[key]){
                            team[key] = newDataTeam[key];
                        }
                    }
                    team.save(function(err, teamUpdated){
                        if(err){
                            response.json('500', err.message);
                        }
                        else {
                            response.json('200', teamUpdated);
                        }
                    });
                }
            });
        } else {
            response.json('400', {'message': 'Bad Request'});
        }
    };
    return TeamRoute;
})();

module.exports = function(app) {
    var teamRoute = new TeamRoute(app);
    app.get(route.TeamRoute, teamRoute.getTeam);
    app.get(route.TeamsRoute, teamRoute.getTeams);
    app.post(route.TeamsRoute, teamRoute.saveTeam);
    app.delete(route.TeamRoute, teamRoute.removeTeam);
    app.put(route.TeamRoute, teamRoute.updateTeam);
};