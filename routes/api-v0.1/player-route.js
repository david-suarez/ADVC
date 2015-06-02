var express = require('express');
var route = require('./routes');
var PlayerModel = require('../../models/player-model');
var __bind = function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var PlayerRoute = (function() {
    function PlayerRoute() {
        this.getPlayer = __bind(this.getPlayer, this);
        this.getPlayers = __bind(this.getPlayers, this);
        this.savePlayer = __bind(this.savePlayer, this);
        this.removePlayer = __bind(this.removePlayer, this);
        this.updatePlayer = __bind(this.updatePlayer, this);
    }

    PlayerRoute.prototype.getPlayer = function(request, response){
        var player_id = request.params.player_id;
        PlayerModel.findById(player_id, function(error, data) {
            if(error){
                response.json(500, error.message);
            }
            else{
                response.json(200, data);
            }
        });
    };

    PlayerRoute.prototype.getPlayers = function(request, response){
        var filter = request.body;
        var query = PlayerModel.find(filter);
        query.exec(function(error, data) {
            if (error) {
                response.json(500, error.message);
            } else {
                response.json(200, data);
            }
        });
    };

    PlayerRoute.prototype.savePlayer = function(request, response){
        var newPlayer;
        newPlayer = request.body.player;
        if(newPlayer !== undefined) {
            PlayerModel.create(newPlayer, function (error, data) {
                if (error) {
                    console.log(error);
                    response.json(500, error.message);
                } else {
                    response.json(201, data);
                }
            });
        } else {
            response.json(400, {'message': 'Bad Request'});
        }
    };

    PlayerRoute.prototype.removePlayer = function(request, response) {
        var player_id = request.params.player_id;
        PlayerModel.remove({_id: player_id}, function(err, doc){
            if (err){
                response.json(500, err.message);
            } else {
                response.json(200, doc);
            }
        });
    };

    PlayerRoute.prototype.updatePlayer = function(request, response) {
        var player_id = request.params.player_id;
        var newDataPlayer = request.body.newDataPlayer;
        if(player_id !== undefined && newDataPlayer !== undefined) {
            PlayerModel.findById(player_id, function(error, player) {
                if(error){
                    response.json(500, error.message);
                }
                else{
                    for (var key in newDataPlayer) {
                        console.log(key);
                        if(player[key]){
                            player[key] = newDataPlayer[key];
                        }
                    }
                    player.save(function(err, playerUpdated){
                        if(err){
                            response.json(500, err.message);
                        }
                        else {
                            response.json(200, playerUpdated);
                        }
                    });
                }
            });
        } else {
            response.json(400, {'message': 'Bad Request'});
        }
    };

    return PlayerRoute;
})();

module.exports = function(app) {
    var playerRoute;
    playerRoute = new PlayerRoute(app);
    app.get(route.Player_Route, playerRoute.getPlayer);
    app.get(route.Players_Route, playerRoute.getPlayers);
    app.post(route.Players_Route, playerRoute.savePlayer);
    app.delete(route.Player_Route, playerRoute.removePlayer);
    app.put(route.Player_Route, playerRoute.updatePlayer);
};
