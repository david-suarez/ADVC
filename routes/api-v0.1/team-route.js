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
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json(data);
            }
        });
    };

    TeamRoute.prototype.getTeams = function(request, response) {
        var filter = request.query;
        var query = TeamModel.find(filter).populate('club').sort({sequence: 1});
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                var dataResult = [];
                for(var index = 0; index < data.length; index++){
                    dataResult.push({
                        id: data[index]._id,
                        name: data[index].name,
                        division: data[index].division,
                        branch: data[index].branch,
                        category: data[index].category,
                        club: data[index].club.name
                    })
                }
                response.status(200).json({data: dataResult});
            }
        });
    };

    TeamRoute.prototype.saveTeam = function(request, response) {
        var newTeam;
        newTeam = request.body.team;
        if(newTeam !== undefined) {
             TeamModel.create(newTeam, function (error, data) {
                if (error) {
                    if (error.code)
                        response.status(error.code).json(error.message);
                    else
                        response.status(500).json(error.message);
                } else {
                    response.status(201).json({data: data});
                }
            });
        } else {
            response.json(400, {'message': 'Bad Request'});
        }
    };

    TeamRoute.prototype.removeTeam = function(request, response) {
        var team_id = request.params.team_id;
        TeamModel.remove({_id: team_id}, function(err, doc){
            if (err){
                response.status(500).json(err.message);
            } else {
                response.status(200).json(doc);
            }
        });
    };

    TeamRoute.prototype.updateTeam = function(request, response) {
        var team_id = request.params.team_id;
        var newDataTeam = request.body.newDataTeam;
        if(team_id !== undefined && newDataTeam !== undefined) {
             TeamModel.findById(team_id, function(error, team) {
                if(error){
                    response.status(500).json(error.message);
                }
                else{
                    for (var key in newDataTeam) {
                        if(typeof(team[key]) !== 'undefined'){
                            team[key] = newDataTeam[key];
                        }
                    }
                    team.save(function(err, teamUpdated){
                        if(err){
                            response.status(500).json(err.message);
                        }
                        else {
                            response.status(200).json({ data: teamUpdated });
                        }
                    });
                }
            });
        } else {
            response.status(400).json({'message': 'Bad Request'});
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