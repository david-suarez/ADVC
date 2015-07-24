var route = require('./routes');
var UserModel = require('../../models/user-model');
var Q = require('q');
var __bind = function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var UserRoute = (function(){

    function UserRoute(){
        this.getUser = __bind(this.getUser, this);
        this.getUsers = __bind(this.getUsers, this);
        this.saveUser = __bind(this.saveUser, this);

    }

    UserRoute.prototype.getUser = function(request, response){
        var user_id = request.params.user_id;
        UserModel.findById(user_id, function(error, data) {
            if(error){
                response.status(500).json(error.message);
            }
            else{
                response.status(200).json(data);
            }
        });
    };

    UserRoute.prototype.getUsers = function(request, response){
        var filter = request.body;
        var query = UserModel.find(filter);
        //query.sort(sortBy);
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                response.status(200).json({data: data});
            }
        });
    };

    UserRoute.prototype.saveUser = function(request, response){
        var newUser;
        newUser = request.body.user;
        if(newUser !== undefined) {
            UserModel.create(newUser, function (error, data) {
                if (error) {
                    response.status(500).json(error.message);
                } else {
                    response.status(201).json(data);
                }
            });
        } else {
            response.json(400, {'message': 'Bad Request'});
        }
    };

    UserRoute.prototype.removeUser = function(request, response) {
        var user_id = request.params.user_id;
        UserModel.remove({_id: user_id}, function(err, doc){
            if (err){
                response.status(500).json(err.message);
            } else {
                response.status(200).json({user_id: user_id});
            }

        });
    };

    UserRoute.prototype.updateUser = function (request, response){
        var user_id = request.params.user_id;
        var newDataUser = request.body.newDataUser;
        if(user_id !== undefined && newDataUser !== undefined){
            UserModel.findById(user_id, function(error, user) {
                if(error){
                    response.status(500).json(err.message);
                }
                else{
                    for(var key in newDataUser){
                        if(typeof(user[key]) !== 'undefined'){
                            user[key] = newDataUser[key];
                        }
                    }
                    user.save(function(err, userUpdated){
                        if(err){
                            response.status(500).json(err.message);
                        }
                        else{
                            response.status(200).json(userUpdated);
                        }
                    })
                }
            });
        }
    };

    return UserRoute;
})();

module.exports = function(app) {
    var userRoute;
    userRoute = new UserRoute(app);
    app.get(route.UsersRoute, userRoute.getUsers);
    app.get(route.UserRoute, userRoute.getUser);
    app.put(route.UserRoute, userRoute.updateUser);
    app.post(route.UsersRoute, userRoute.saveUser);
    app.delete(route.UserRoute, userRoute.removeUser);
};
