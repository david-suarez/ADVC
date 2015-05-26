/**
 * Created by Baby_Moico on 25/05/2015.
 */
var express = require('express');
var route = require('./routes');
var ClubModel = require('../../models/club-model');
var Q = require('q');
var __bind =function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

var ClubRoute = (function (){

    function ClubRoute(){
        this.getClub = __bind(this.getClub, this);
        this.getClubs = __bind(this.getClubs,this);
        this.saveClub = __bind(this.saveClub,this);
        this.model = ClubModel;
    }

    ClubRoute.prototype.getClub = function(request, response){
        var club_id = request.params.club_id;
        this.model.findById(club_id, function(error, data) {
            if(error){
                response.json(error.statusCode, null);
            }
            else{
                response.json('200', data);
            }
        });
    };

    ClubRoute.prototype.getClubs = function(request, response){
        var filter = request.body;
        var query = this.model.find(filter);
        //query.sort(sortBy);
        query.exec(function(error, data) {
            if (error) {
                response.json(error.statusCode, null);
            } else {
                response.json('200', data);
            }
        });
    };

    ClubRoute.prototype.saveClub = function(request, response){
        var newClub;
        //var deferred = Q.defer();
        newClub = request.body;
        //console.log(request.body);
        //if(newClub !== undefined) {
            this.model.create(newClub, function (error, data) {
                if (error) {
                    response.json(error.statusCode, null);
                } else {
                    response.json('200', data);
                }
            });
        //} else {
          //  response.json('400', {'message': 'Bad Request'});
        //}
    };
    return ClubRoute;
})();


module.exports = function(app) {
    var clubRoute;
    clubRoute = new ClubRoute(app);
    app.get(route.ClubsRoute, clubRoute.getClubs);
    app.get(route.ClubRoute, clubRoute.getClub);
    //app.put(route.ClubRoute, clubRoute.updateClub);
    app.post(route.ClubsRoute, clubRoute.saveClub);
    //app.post(route.ClubUploadImageRoute, clubRoute.uploadClubImage);
    //app["delete"](route.ClubRoute, clubRoute.removeClub);
};