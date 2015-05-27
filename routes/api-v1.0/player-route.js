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
        this.model = PlayerModel;
    }

    PlayerRoute.prototype.getPlayer = function(request, response){
        var player_id = request.params.player_id;
        this.model.findById(player_id, function(error, data) {
            if(error){
                response.json('500', error.message);
            }
            else{
                response.json('200', data);
            }
        });
    };

    PlayerRoute.prototype.getPlayers = function(request, response){
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

    PlayerRoute.prototype.savePlayer = function(request, response){
        var newPlayer;
        newPlayer = request.body;
        this.model.create(newPlayer, function (error, data) {
            if (error) {
                console.log(error);
                response.json('500', error.message);
            } else {
                response.json('200', data);
            }
        });
    };
    return PlayerRoute;
})();

module.exports = function(app) {
    var playerRoute;
    playerRoute = new PlayerRoute(app);
    app.get(route.Player_Route, playerRoute.getPlayer);
    app.get(route.Players_Route, playerRoute.getPlayers);
    app.post(route.Players_Route, playerRoute.savePlayer);
};
