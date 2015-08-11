var route = require('./routes');
var PlayerModel = require('../../models/player-model');
var Q = require('q');
var easyimg = require('easyimage');

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
        this.removeImagePlayer = __bind(this.removeImagePlayer, this);
        this.uploadImagePlayer = __bind(this.uploadImagePlayer, this);
    }

    PlayerRoute.prototype.getPlayer = function(request, response){
        var player_id = request.params.player_id;
        PlayerModel.findById(player_id, function(error, data) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json(data);
            }
        });
    };

    PlayerRoute.prototype.getPlayers = function(request, response){
        var self = this;
        var filter = request.query;
        var query = PlayerModel.find(filter);
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                response.status(200).json({data: data});
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
                    response.status(500).json(error.message);
                } else {
                    response.status(201).json(data);
                }
            });
        } else {
            response.status(500).json({'message': 'Bad Request'});
        }
    };

    PlayerRoute.prototype.removePlayer = function(request, response) {
        var player_id = request.params.player_id;
        PlayerModel.remove({_id: player_id}, function(err, doc){
            if (err){
                response.status(500).json(err.message);
            } else {
                response.status(200).json(doc);
            }
        });
    };

    PlayerRoute.prototype.updatePlayer = function(request, response) {
        var player_id = request.params.player_id;
        var newDataPlayer = request.body.newDataPlayer;
        if(player_id !== undefined && newDataPlayer !== undefined) {
            PlayerModel.findById(player_id, function(error, player) {
                if(error){
                    response.status(500).json(error.message);
                }
                else{
                    for (var key in newDataPlayer) {
                        if(typeof(player[key]) !== 'undefined'){
                            player[key] = newDataPlayer[key];
                        }
                    }
                    player.save(function(err, playerUpdated){
                        if(err){
                            response.status(500).json(err.message);
                        }
                        else {
                            response.status(200).json(playerUpdated);
                        }
                    });
                }
            });
        } else {
            response.status(400).json({'message': 'Bad Request'});
        }
    };

    PlayerRoute.prototype.uploadImagePlayer = function(request, response){
        if(request.files != undefined){
            var file = request.files.file;
            easyimg.rescrop({
                src:'./public/uploads/' + file.name,
                dst:'./public/uploads/thumbs/' + file.name,
                width:640, height:480,
                croopCoord: file.coords,
                gravity: "NorthWest",
                x:0, y:0
            }).then(
                function(image) {
                    console.log('Resized and cropped: '
                        + image.width + ' x ' + image.height);
                    response.status(201).json({'result': file.name});
                },
                function (err) {
                    console.log(err);
                    response.status(500).json({'message': 'Internal error'});
                }
            );

        } else{
            response.status(400).json({'message': 'Bad Request'});
        }
    };

    PlayerRoute.prototype.removeImagePlayer = function(request, response){

    };

    return PlayerRoute;
})();

module.exports = function(app) {
    var playerRoute;
    playerRoute = new PlayerRoute(app);
    app.get(route.PlayerRoute, playerRoute.getPlayer);
    app.get(route.PlayersRoute, playerRoute.getPlayers);
    app.post(route.PlayersRoute, playerRoute.savePlayer);
    app.delete(route.PlayerRoute, playerRoute.removePlayer);
    app.put(route.PlayerRoute, playerRoute.updatePlayer);
    app.post(route.PlayersUploadRoute, playerRoute.uploadImagePlayer);
    app.delete(route.PlayersDeleteRoute, playerRoute.removeImagePlayer);
};
