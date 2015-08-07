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
        this.saveTransfers = __bind(this.saveTransfers,this);
        this.updateTransfers = __bind(this.updateTransfers, this);
    }

    TransfersRoute.prototype.getTransfer = function(request, response){
        var transfer_id = request.params.transfer_id;
        TransfersModel.findById(transfer_id, function(error, data) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json(data);
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
                    response.status(201).json(data);
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
                            response.status(200).json(recordUpdated);
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