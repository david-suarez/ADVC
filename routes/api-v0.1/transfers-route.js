var route = require('./routes');
var TransfersModel = require('../../models/transfers-model');
var PlayerModel = require('../../models/player-model');
var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};
var TransfersRoute = (function (){

    function TransfersRoute(){
        this.getTransfers = __bind(this.getTransfers, this);
        this.getTransfer = __bind(this.getTransfer, this);
        this.saveTransfers = __bind(this.saveTransfers,this);
        this.updateTransfers = __bind(this.updateTransfers, this);
    }

    TransfersRoute.prototype.getTransfer = function(request, response){
        var transferId = request.params.transfersId;
        TransfersModel.findById(transferId, function(error, data) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json(data);
            }
        });
    };

    TransfersRoute.prototype.getTransfers = function(request, response){
        var filter = request.query;
        var path =  [{path:'player'}, {path:'originClub'}, {path:'newClub'}];
        var query = TransfersModel.find(filter).sort({date: 1}).populate(path);
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                var index = 0;
                var resultData = [];
                var transfer = {};
                for(index; index < data.length; index++){
                    if(data[index].player){
                        transfer.player = {
                            _id: data[index].player._id,
                            name: data[index].player.name,
                            lastname: data[index].player.lastname
                        };
                    }
                    if(data[index].originClub){
                        transfer.originClub = {
                            _id: data[index].originClub._id,
                            name: data[index].originClub.name
                        };
                    }
                    if(data[index].newClub){
                        transfer.newClub = {
                            _id: data[index].newClub._id,
                            name: data[index].newClub.name
                        };
                    }
                    transfer.year = data[index].year;
                    transfer.requestDate = data[index].requestDate;
                    transfer.status = data[index].status;
                    transfer._id = data[index]._id;
                    resultData.push(transfer);
                    transfer = {};
                }
                response.status(200).json({data: resultData});
            }
        });
    };

    TransfersRoute.prototype.saveTransfers = function(request, response){
        var newTransfer;
        newTransfer = request.body.transfer;
        if(newTransfer !== undefined) {
            TransfersModel.create(newTransfer, function (error, data) {
                if (error) {
                    response.status(500).json(error.message);
                } else {
                    var path =  [{path:'player'}, {path:'originClub'},
                        {path:'newClub'}];
                    TransfersModel.findById(data._id).populate(path)
                        .exec(function(err, transfer){
                            if(!err){
                                var resultData = {
                                    _id: transfer._id,
                                    player: {
                                        _id: transfer.player._id,
                                        name: transfer.player.name,
                                        lastname: transfer.player.lastname
                                        },
                                    originClub: {
                                        _id: transfer.originClub._id,
                                        name: transfer.originClub.name
                                        },
                                    newClub: {
                                        _id: transfer.newClub._id,
                                        name: transfer.newClub.name
                                    },
                                    year: transfer.year,
                                    requestDate: transfer.requestDate,
                                    status: transfer.status
                                };
                                response.status(201).json(resultData);
                            } else{
                                response.status(500).json(err.message);
                            }
                    });
                }
            });
        } else {
            response.status(400).json({'message': 'Bad Request'});
        }
    };

    TransfersRoute.prototype.updateTransfers = function (request, response){
        var transferId = request.params.transfersId;
        var newTransferData = request.body.transfer;
        var newClubAssigned = {};
        var self = this;
        if(transferId !== undefined && newTransferData !== undefined){
            TransfersModel.findById(transferId, function(error, transfer) {
                if(error){
                    response.status(500).json(error.message);
                }
                else{
                    for(var key in newTransferData){
                        if(typeof(transfer[key]) !== 'undefined'){
                            transfer[key] = newTransferData[key];
                        }
                    }
                    if(typeof(transfer['status']) !== 'undefined'){
                        console.log(transfer['status']);
                        if(transfer['status'] === 'Transferido'){
                            newClubAssigned.change = true;
                            newClubAssigned.clubId = transfer['newClub'];
                            newClubAssigned.playerId = transfer['player'];
                        }
                    }
                    transfer.save(function(err, recordUpdated){
                        if(err){
                            if (err.code)
                                response.status(err.code).json(err.message);
                            else
                                response.status(500).json(err.message);
                        }else{
                            var path =  [{path:'player'}, {path:'originClub'},
                                {path:'newClub'}];
                            TransfersModel.findById(recordUpdated._id).populate(path)
                                .exec(function(error1, populateTransfer){
                                    if(error1){
                                        response.status(500).json(error.message);
                                    } else {
                                        var resultData = {
                                            _id: populateTransfer._id,
                                            player: {
                                                _id: populateTransfer.player._id,
                                                name: populateTransfer.player.name,
                                                lastname: populateTransfer.player.lastname
                                            },
                                            originClub: {
                                                _id: populateTransfer.originClub._id,
                                                name: populateTransfer.originClub.name
                                            },
                                            newClub: {
                                                _id: populateTransfer.newClub._id,
                                                name: populateTransfer.newClub.name
                                            },
                                            year: populateTransfer.year,
                                            requestDate: populateTransfer.requestDate,
                                            status: populateTransfer.status
                                        };
                                        if(newClubAssigned.change){
                                            self.changeClubPlayer(response,
                                                resultData,newClubAssigned);
                                        } else{
                                            response.status(200).json(resultData);
                                        }

                                    }
                            });

                        }
                    })
                }
            });
        } else{
            response.status(400).json('Bad request')
        }

    };

    TransfersRoute.prototype.changeClubPlayer = function(response,
                                                         resultData,
                                                         newClubAssigned){
        var playerId = newClubAssigned.playerId;
        var clubId = newClubAssigned.clubId;
        PlayerModel.findById(playerId, function(error, player){
            player.changeClub(clubId)
                .then(function(player){
                    console.log('--------------------------------');
                    console.log('Change club to player ' +
                        player.name + player.lastname);
                    console.log('--------------------------------');
                    resultData.newDataPlayer = player;
                    response.status(200).json(resultData);
                })
                .fail(function(error){
                    response.status(500).json(error.message);
                })
        });
    };

    return TransfersRoute;
})();

module.exports = function(app) {
    var transferRoute;
    transferRoute = new TransfersRoute(app);
    app.get(route.TransferRoute, transferRoute.getTransfer);
    app.get(route.TransfersRoute, transferRoute.getTransfers);
    app.post(route.TransfersRoute, transferRoute.saveTransfers);
    app.put(route.TransferRoute, transferRoute.updateTransfers);
};