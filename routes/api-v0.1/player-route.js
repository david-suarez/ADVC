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
        var playerId = request.params.playerId;
        var populateQuery = [
            {path:'club', select:'_id name'},
            {path:'team', select:'_id category division name'},
            {path:'transfer', select:'_id originClub'}
        ];
        PlayerModel.findById(playerId).populate(populateQuery)
            .exec(function(error, data) {
                if(error){
                    response.status(500).json(error.message);
                }
                else{
                    response.status(200).json(data);
                }
            }
        );
    };

    PlayerRoute.prototype.getPlayers = function(request, response){
        var self = this;
        var filter = request.query;
        var populateQuery = [
            {path:'transfer', select:'_id originClub'},
        ];
        var query = PlayerModel
            .find(filter)
            .sort({status: -1})
            .populate(populateQuery);
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                var options = {
                    path: 'transfer.originClub',
                    model: 'Club',
                    select: 'name'
                };
                PlayerModel.populate(data, options, function(err, players){
                    if(!err)
                        response.status(200).json({data: players});
                    else
                        response.status(500).json(error.message);
                });
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
        var playerId = request.params.playerId;
        PlayerModel.remove({_id: playerId}, function(err, doc){
            if (err){
                response.status(500).json(err.message);
            } else {
                response.status(200).json(doc);
            }
        });
    };

    PlayerRoute.prototype.updatePlayer = function(request, response) {
        var playerId = request.params.playerId;
        var newDataPlayer = request.body.newDataPlayer;
        if(playerId !== undefined && newDataPlayer !== undefined) {
            PlayerModel.findById(playerId, function(error, player) {
                if(error){
                    response.status(500).json(error.message);
                }
                else{
                    var lenghtTeam = player.team.length;
                    for (var key in newDataPlayer) {
                        if(key === 'majorCategory' &&
                            typeof(player.majorCategory) !== 'undefined'){
                            if(lenghtTeam > newDataPlayer.team.length){
                                player.majorCategory = newDataPlayer[key];
                                continue;
                            }
                            else{
                                player.majorCategory = true;
                                continue;
                            }
                        } else if(key === 'majorCategory'){
                            player.majorCategory = newDataPlayer[key];
                            continue;
                        }
                        player[key] = newDataPlayer[key];
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
