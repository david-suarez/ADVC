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
        this.model = TeamModel;
    }

    TeamRoute.prototype.getTeam = function(request, response) {
        var team_id = request.params.team_id;
        this.model.findById(team_id, function(error, data) {
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
        var query = this.model.find(filter);
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
        newTeam = request.body;
        if(newTeam !== undefined) {
            this.model.create(newTeam, function (error, data) {
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

    return TeamRoute;
})();

module.exports = function(app) {
    var teamRoute = new TeamRoute(app);
    app.get(route.TeamRoute, teamRoute.getTeam);
    app.get(route.TeamsRoute, teamRoute.getTeams);
    app.post(route.TeamsRoute, teamRoute.saveTeam);
};