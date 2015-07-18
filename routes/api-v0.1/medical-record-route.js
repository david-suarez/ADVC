/**
 * Created by Gris on 15/07/2015.
 */
var route = require('./routes');
var MedicalRecordModel = require('../../models/medicalRecord-model');
var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};
var MedicalRecordRoute = (function (){

    function MedicalRecordRoute(){
        this.getMedicalRecord = __bind(this.getMedicalRecord, this);
        this.getMedicalRecords = __bind(this.getMedicalRecords,this);
        this.saveMedicalRecord = __bind(this.saveMedicalRecord,this);
        this.removeMedicalRecord = __bind(this.removeMedicalRecord,this);
        this.updateMedicalRecord = __bind(this.updateMedicalRecord, this);
    }

    MedicalRecordRoute.prototype.getMedicalRecord = function(request, response){
        var medicalRecord_id = request.params.medicalRecord_id;
        MedicalRecordModel.findById(medicalRecord_id, function(error, data) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json(data);
            }
        });
    };

    MedicalRecordRoute.prototype.getMedicalRecords = function(request, response){
        var filter = request.body;
        var query = MedicalRecordModel.find(filter).populate('player');
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                response.status(200).json({data: data});
            }
        });
    };

    MedicalRecordRoute.prototype.saveMedicalRecord = function(request, response){
        var newMedicalRecord;
        newMedicalRecord = request.body.medicalRecord;
        if(newMedicalRecord !== undefined) {
            MedicalRecordModel.create(newMedicalRecord, function (error, data) {
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

    MedicalRecordRoute.prototype.removeMedicalRecord = function(request,
                                                                response){
        var medicalRecordId = request.params.medicalId;
        MedicalRecordModel.remove({_id: medicalRecordId}, function(err, doc){
            if(err){
                response.status(500).json(error.message);
            } else {
                response.status(200).send({medicalRecordId: medicalRecordId});
            }

        });
    };

    MedicalRecordRoute.prototype.updateMedicalRecord = function (request,
                                                                 response){
        var medicalId = request.params.medicalId;
        var medicalRecord = request.body.medicalRecord;
        if(medicalId !== undefined && medicalRecord !== undefined){
            MedicalRecordModel.findById(medicalId, function(error, record) {
                if(error){
                    response.json(500, err.message);
                }
                else{
                    for(var key in medicalRecord){
                        if(typeof(record[key]) !== 'undefined'){
                            record[key] = medicalRecord[key];
                        }
                    }
                    record.save(function(err, recordUpdated){
                        if(err){
                            response.status(500).json(err.message);
                        }
                        else{
                            response.status(200).json(recordUpdated);
                        }
                    })
                }
            });
        }
    };

    return MedicalRecordRoute;
})();


module.exports = function(app) {
    var medicalRecordRoute;
    medicalRecordRoute = new MedicalRecordRoute(app);
    app.get(route.MedicalRecordsRoute, medicalRecordRoute.getMedicalRecords);
    app.get(route.MedicalRecordRoute, medicalRecordRoute.getMedicalRecord);
    app.put(route.MedicalRecordRoute, medicalRecordRoute.updateMedicalRecord);
    app.post(route.MedicalRecordsRoute, medicalRecordRoute.saveMedicalRecord);
    app.delete(route.MedicalRecordRoute, medicalRecordRoute.removeMedicalRecord);
};