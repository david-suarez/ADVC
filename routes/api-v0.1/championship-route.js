var route = require('./routes');
var ChampionshipModel = require('../../models/championship-model');
var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};
var ChampionshipRoute = (function (){

    function ChampionshipRoute(){
        this.getChampionship = __bind(this.getChampionship, this);
        this.getChampionships = __bind(this.getChampionships,this);
        this.saveChampionship = __bind(this.saveChampionship,this);
        this.deleteChampionship = __bind(this.deleteChampionship,this);
        this.updateChampionship = __bind(this.updateChampionship, this);
    }

    ChampionshipRoute.prototype.getChampionship = function(request, response){
        var championship_id = request.params.championshipId;
        console.log(request.params);
        ChampionshipModel.findById(championship_id, function(error, data) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json(data);
            }
        });
    };

    ChampionshipRoute.prototype.getChampionships = function(request, response){
        var filter = request.body;
        var query = ChampionshipModel.find(filter).populate('teams');
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                var index = 0;
                var teams = {};
                for(index; index < data.length; index++){
                    if(data[index].teams){
                        teams = {
                            _id: data[index].teams._id,
                            name: data[index].teams.name
                        };
                        data[index].teams = teams;
                    }
                }
                response.status(200).json({data: data});
            }
        });
    };

    ChampionshipRoute.prototype.saveChampionship = function(request, response){
        var newChampionship;
        newChampionship = request.body.championship;
        if(newChampionship !== undefined) {
            ChampionshipModel.create(newChampionship, function (error, data) {
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

    ChampionshipRoute.prototype.deleteChampionship = function(request,response){
        var championshipId = request.params.championshipId;
        ChampionshipModel.remove({_id: championshipId}, function(err, doc){
            if(err){
                response.status(500).json(error.message);
            } else {
                response.status(200).send({championshipId: championshipId});
            }

        });
    };

    ChampionshipRoute.prototype.updateChampionship = function (request, response){
        var championship_id = request.params.championshipId;
        var newDataChampionship = request.body.championship;
        if(championship_id !== undefined && championship !== undefined){
            ChampionshipModel.findById(championship_id, function(error, championship) {
                if(error){
                    response.status(500).json(error.message);
                }
                else{
                    for(var key in championship){
                        if(typeof(championship[key]) !== 'undefined'){
                            championship[key] = championship[key];
                        }
                    }
                    championship.save(function(err, championshipUpdated){
                        if(err){
                            response.status(500).json(error.message);
                        }
                        else{
                            response.status(200).json(championshipUpdated);
                        }
                    })
                }
            });
        }
    };
    return ChampionshipRoute;
})();

module.exports = function(app) {
    var championshipRoute;
    championshipRoute = new ChampionshipRoute(app);
    app.get(route.ChampionshipsRoute, championshipRoute.getChampionships);
    app.get(route.ChampionshipRoute, championshipRoute.getChampionship);
    app.put(route.ChampionshipRoute, championshipRoute.saveChampionship);
    app.post(route.ChampionshipsRoute, championshipRoute.saveClub);
    app.delete(route.ChampionshipRoute, championshipRoute.deleteChampionship);
};