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
        var club_id = request.params.clubId;
        console.log(request.params);
        ClubModel.findById(club_id, function(error, data) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json(data);
            }
        });
    };

    ClubRoute.prototype.getClubs = function(request, response){
        var filter = request.body;
        var query = ClubModel.find(filter).populate('delegate');
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                response.status(200).json({data: data});
            }
        });
    };

    ClubRoute.prototype.saveClub = function(request, response){
        var newClub;
        newClub = request.body.club;
        if(newClub !== undefined) {
            ClubModel.create(newClub, function (error, data) {
                if (error) {
                    response.status(500).json(error.message);
                } else {
                    response.status(201).json(data);
                }
            });
        } else {
            response.status(400).json({'message': 'Bad Request'});
        }
    };

    ClubRoute.prototype.removeClub = function(request,response){
        var clubId = request.params.clubId;
        ClubModel.remove({_id: clubId}, function(err, doc){
            if(err){
                response.status(500).json(error.message);
            } else {
               response.status(200).send({clubId: clubId});
           }

        });
    };

    ClubRoute.prototype.updateClub = function (request, response){
        var club_id = request.params.clubId;
    var newDataClub = request.body.newDataClub;
    if(club_id !== undefined && newDataClub !== undefined){
        ClubModel.findById(club_id, function(error, club) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                for(var key in newDataClub){
                    if(typeof(club[key]) !== 'undefined'){
                        club[key] = newDataClub[key];
                    }
                }
                club.save(function(err, clubUpdated){
                    if(err){
                        response.status(500).json(error.message);
                    }
                    else{
                        response.status(200).json(clubUpdated);
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