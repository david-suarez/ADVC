var express = require('express');
var User = require('./user-route');
var route = require('./routes');
var UserModel = require('../../models/user-model');
var Q = require('q');
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

var UserRoute = (function(){

    function UserRoute(){
        this.getUser = __bind(this.getUser, this);
        this.getUsers = __bind(this.getUsers, this);
        this.saveUser = __bind(this.saveUser, this);
        this.model = UserModel;
    }

    UserRoute.prototype.getUser = function(request, response){
        var user_id = request.params.employee_id;
        this.model.findById(user_id, function(error, data) {
            if(error){
                response.json(error.statusCode, null);
            }
            else{
                response.json('200', data);
            }
        });
    };

    UserRoute.prototype.getUsers = function(request, response){
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

    UserRoute.prototype.saveUser = function(request, response){
        var newUser;
        //var deferred = Q.defer();
        newUser = request.body;
        //console.log(request.body);
        if(newUser !== undefined) {
            this.model.create(newUser, function (error, data) {
                if (error) {
                    response.json(error.statusCode, null);
                } else {
                    response.json('200', data);
                }
            });
        } else {
            response.json('400', {'message': 'Bad Request'});
        }
    };
    return UserRoute;
})();

module.exports = function(app) {
    var userRoute;
    userRoute = new UserRoute(app);
    app.get(route.UsersRoute, userRoute.getUsers);
    app.get(route.UserRoute, userRoute.getUser);
    //app.put(route.UserRoute, userRoute.updateUser);
    app.post(route.UsersRoute, userRoute.saveUser);
    //app.post(route.UserUploadImageRoute, userRoute.uploadUserImage);
    //app["delete"](route.UserRoute, userRoute.removeUser);
};
