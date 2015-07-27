
var route = require('./routes');
var fs = require('fs');
var PublicationModel = require('../../models/publication-model');
var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var PublicationRoute = (function () {

    function PublicationRoute() {
        this.getPublication = __bind(this.getPublication, this);
        this.getPublications = __bind(this.getPublications, this);
        this.savePublications = __bind(this.savePublications, this);
        this.deletePublication = __bind(this.deletePublication, this);
        this.updatePublication = __bind(this.updatePublication, this);
        this.uploadFile = __bind(this.uploadFile, this);
    }

    PublicationRoute.prototype.getPublication = function(request, response){
        var publicationId = request.params.publicationId;
        PublicationModel.findById(publicationId, function(error, data) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json({data: data});
            }
        });
    };
    PublicationRoute.prototype.getPublications = function(request, response){
        var filter = request.body;
        var query = PublicationModel.find(filter).sort({date: -1});
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                response.status(200).json({data: data});
            }
        });
    };
    PublicationRoute.prototype.savePublications = function(request, response){
        if(request.body.publication != undefined){
            var newPublication = request.body.publication;

            PublicationModel.create(newPublication, function (error, data) {
                if (error) {
                    response.status(500).json(error.message);
                } else {
                    response.status(201).json(data);
                }
            });
        }else {
            response.status(400).json({'message': 'Bad Request'});
        }

    };
    PublicationRoute.prototype.deletePublication = function(request, response){
        var publicationId = request.params.publicationId;
        var pathFile = './public/uploads/';

        PublicationModel.findById(publicationId, function(error, publication) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                PublicationModel.remove({_id: publicationId}, function(err, doc){
                    if (err){
                        response.status(500).json(err.message);
                    } else if(publication.file){
                        pathFile += publication.file;
                        try {
                            fs.unlink(pathFile, function (error) {
                                if (error)
                                    console.log('There was an error trying ' +
                                        'to delete file ' + pathFile);
                            });
                        } catch (e) {
                            console.log('File ' + pathFile + ' has been ' +
                                'deleted before');
                        }
                        response.status(200).
                            json({publicationId: publicationId});
                    } else {
                        response.status(200).
                            json({publicationId: publicationId});
                    }
                });
            }
        });
    };
    PublicationRoute.prototype.updatePublication = function(request, response){
        var publicationId = request.params.publicationId;
        var newDataPublication = request.body.newDataPublication;
        if(publicationId !== undefined && newDataPublication !== undefined) {
            PublicationModel.findById(publicationId, function(error, pub) {
                if(error){
                    response.status(500).json(error.message);
                }
                else{
                    var type = pub.type;
                    for (var key in newDataPublication) {
                        if(typeof(pub[key]) !== 'undefined'){
                            pub[key] = newDataPublication[key];
                        }
                    }
                    pub.save(function(err, publicationUpdated){
                        if(err){
                            response.status(500).json(err.message);
                        }
                        else {
                            response.status(200).json(
                                {pub:publicationUpdated,
                                prevType:type});
                        }
                    });
                }
            });
        } else {
            response.json(400, {'message': 'Bad Request'});
        }
    };
    PublicationRoute.prototype.uploadFile = function(request, response){
        if(request.files != undefined){
            var file = request.files.file;
            response.status(201).json({'result': file.name});
        } else{
            response.status(400).json({'message': 'Bad Request'});
        }
    };
    PublicationRoute.prototype.deleteFile = function(request, response){
        var publicationId = request.params.publicationId;
        var fileName = request.body.fileName;
        var pathFile = './public/uploads/' + fileName;
        fs.unlink(pathFile, function (error) {
            if (error) response.status(500).json(error.message);
            PublicationModel.findById(publicationId, function(error, pub) {
                if(error){
                    response.status(500).json(error.message);
                }
                else {
                    pub.file = '';
                    pub.fileName = '';
                    pub.type = 'main';
                    pub.save(function(err, publicationUpdated){
                        if(err){
                            response.status(500).json(err.message);
                        }
                        else {
                            response.status(200).json(publicationUpdated);
                        }
                    });
                }
            });
        });
    };
    return PublicationRoute;
})();

module.exports = function(app){
    var pubRoute;
    pubRoute = new PublicationRoute();
    app.get(route.PubRoute, pubRoute.getPublication);
    app.get(route.PubsRoute, pubRoute.getPublications);
    app.put(route.PubRoute, pubRoute.updatePublication);
    app.post(route.PubsRoute, pubRoute.savePublications);
    app.delete(route.PubRoute, pubRoute.deletePublication);
    app.post(route.PubDeleteFile, pubRoute.deleteFile);
    app.post(route.PubUploadFile, pubRoute.uploadFile);
};