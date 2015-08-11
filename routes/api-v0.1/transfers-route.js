var route = require('./routes');
var TransfersModel = require('../../models/transfers-model');
var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};
var TransfersRoute = (function (){

    function TransfersRoute(){
        this.getTransfer = __bind(this.getTransfer, this);
        //this.getTransfers = __bind(this.getTransfers, this);
        this.saveTransfers = __bind(this.saveTransfers,this);
        this.updateTransfers = __bind(this.updateTransfers, this);
    }

    //TransfersRoute.prototype.getTransfer = function(request, response){
    //    var transfer_id = request.params.transfer_id;
    //    TransfersModel.findById(transfer_id, function(error, data) {
    //        if(error){
    //            response.status(500).json(error.message);
    //        }
    //        else{
    //            response.status(200).json(data);
    //        }
    //    });
    //};

    //TransfersRoute.prototype.getTransfer = function(request, response){
    //    var filter = request.query;
    //    console.log(filter);
    //    var query = TransfersModel.find(filter).sort({date: 1});
    //    query.exec(function(error, data) {
    //        if (error) {
    //            response.status(500).json(error.message);
    //        } else {
    //            response.status(200).json({data: data});
    //        }
    //    });
    //};

    TransfersRoute.prototype.getTransfer = function(request, response){
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
        var transfer = request.body.transfer;
        if(transferId !== undefined && transfer !== undefined){
            TransfersModel.findById(transferId, function(error, record) {
                if(error){
                    response.status(500).json(error.message);
                }
                else{
                    for(var key in transfer){
                        if(typeof(record[key]) !== 'undefined'){
                            record[key] = transfer[key];
                        }
                    }
                    record.save(function(err, recordUpdated){
                        if(err){
                            response.status(500).json(error.message);
                        }
                        else{
                            var path =  [{path:'player'}, {path:'originClub'},
                                {path:'newClub'}];
                            TransfersModel.findById(recordUpdated._id).populate(path)
                                .exec(function(error1, populateTransfer){
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
                                    response.status(200).json(resultData);
                            });

                        }
                    })
                }
            });
        }
    };

    return TransfersRoute;
})();

module.exports = function(app) {
    var transferRoute;
    transferRoute = new TransfersRoute(app);
    app.get(route.TransfersRoute, transferRoute.getTransfer);
    app.post(route.TransfersRoute, transferRoute.saveTransfers);
    app.put(route.TransferRoute, transferRoute.updateTransfers);
};