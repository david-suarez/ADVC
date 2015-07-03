/**
 * Created by david on 16-06-15.
 */

var route = require('./routes');
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

    };
    PublicationRoute.prototype.getPublications = function(request, response){
        var filter = request.body;
        var query = PublicationModel.find(filter);
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
            console.log(request.body);
            console.log(newPublication);
            //PublicationModel.create(newPublication, function (error, data) {
            //    if (error) {
            //        console.log(error);
            //        response.status(500).json(error.message);
            //    } else {
            //        response.status(201).json(data);
            //    }
            //});
        }else {
            response.status(400).json({'message': 'Bad Request'});
        }

    };
    PublicationRoute.prototype.deletePublication = function(request, response){

    };
    PublicationRoute.prototype.updatePublication = function(request, response){

    };
    PublicationRoute.prototype.uploadFile = function(request, response){
        console.log('-----------------------------------------------------');
        console.log(request.files);
        if(request.files != undefined){
            console.log(request.files);
        }
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
    app.post(route.PubUploadFile, pubRoute.uploadFile);
};