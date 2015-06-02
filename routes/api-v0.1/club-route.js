/**
 * Created by Baby_Moico on 25/05/2015.
 */
var route = require('./routes');
var ClubModel = require('../../models/club-model');
var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var ClubRoute = (function (){

    function ClubRoute(){
        this.getClub = __bind(this.getClub, this);
        this.getClubs = __bind(this.getClubs,this);
        this.saveClub = __bind(this.saveClub,this);
        this.deleteClub = __bind(this.deleteClub,this);
        this.updateClub = __bind(this.updateClub, this);
    }

    ClubRoute.prototype.getClub = function(request, response){
        var club_id = request.params.club_id;
        ClubModel.findById(club_id, function(error, data) {
            if(error){
                response.json(error.statusCode, null);
            }
            else{
                response.json(200, data);
            }
        });
    };

    ClubRoute.prototype.getClubs = function(request, response){
        var filter = request.body;
        var query = ClubModel.find(filter);
        query.exec(function(error, data) {
            if (error) {
                response.json(error.statusCode, null);
            } else {
                response.json(200, data);
            }
        });
    };

    ClubRoute.prototype.saveClub = function(request, response){
        var newClub;
        newClub = request.body.club;
        if(newClub !== undefined) {
            ClubModel.create(newClub, function (error, data) {
                if (error) {
                    response.json(error.statusCode, null);
                } else {
                    response.json(201, data);
                }
            });
        } else {
            response.json(400, {'message': 'Bad Request'});
        }
    };

    ClubRoute.prototype.removeClub = function(request,response){
        var club_id = request.params.club_id;
        ClubModel.remove({_id: club_id}, function(err, doc){
           if(err){
               response.send(500, err.message);
            } else {
               response.send(200, {club_id: club_id});
           }

        });
    };

    ClubRoute.prototype.updateClub = function (request, response){
        var club_id = request.params.club_id;
    var newDataClub = request.body.newDataClub;
    if(club_id !== undefined && newDataClub !== undefined){
        ClubModel.findById(club_id, function(error, club) {
            if(error){
                response.json(500, err.message);
            }
            else{
                for(var key in newDataClub){
                    if(club[key]){
                        club[key] = newDataClub[key];
                    }
                }
                club.save(function(err, clubUpdated){
                    if(err){
                        response.json(500, err.message);
                    }
                    else{
                        response.json(200, clubUpdated);
                    }
                })
            }
        });
    }
};
    return ClubRoute;
})();


module.exports = function(app) {
    var clubRoute;
    clubRoute = new ClubRoute(app);
    app.get(route.ClubsRoute, clubRoute.getClubs);
    app.get(route.ClubRoute, clubRoute.getClub);
    app.put(route.ClubRoute, clubRoute.updateClub);
    app.post(route.ClubsRoute, clubRoute.saveClub);
    app.delete(route.ClubRoute, clubRoute.removeClub);
};