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
        'defoult': null
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

var TransfersModel = mongoose.model('Transfer', TransfersSchema);
module.exports = TransfersModel;
