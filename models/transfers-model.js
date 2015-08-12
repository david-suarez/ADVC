var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Q = require('q');

var TransfersSchema = new Schema({
    'player': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Player'
    },
    'originClub': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Club'
    },
    'newClub': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'Club'
    },
    'delegate': {
        'type': mongoose.Schema.Types.ObjectId,
        'ref': 'User'
    },
    'requestDate': {
        'type':Date,
        'default':""
    },
    'year': {
        'type': Number,
        'required' : true
    },
    'numInvoce': {
        'type': Number,
        'default': null
    },
    'status': {
        'type': String,
        'index': true,
        'default': "No transferido",
        'enum': [
            "Transferido",
            "No transferido"
            ]
    }
});

TransfersSchema.pre('save', function(next){
    var self = this;
    _validateYearTransfer(self)
        .then(function(result){
            return next();
        })
        .fail(function(error){
            return next(error);
        });
});

var TransfersModel = mongoose.model('Transfer', TransfersSchema);

var _validateYearTransfer = function(transfer){
    var deferred = Q.defer();
    var errorYear = null;
    var filter  = {
        year: transfer.year,
        player: transfer.player
    };
    TransfersModel.findOne(filter).exec(function(err, data){
        if(err){
            deferred.reject(err);
        }else {
            if(data){
                if(!data._id.equals(transfer._id)) {
                    errorYear = new Error('Duplicate transfer');
                    errorYear.code = 409;
                    deferred.reject(errorYear);
                }else{
                    deferred.resolve(true);
                }
            } else{
                deferred.resolve(true);
            }
        }
    });
    return deferred.promise;
};

module.exports = TransfersModel;
