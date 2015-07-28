var route = require('./routes');
var UserModel = require('../../models/user-model');
var Q = require('q');
var __bind = function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var UserRoute = (function(){

    var superAdmin = {
        name: 'Super',
        lastname: 'Admin',
        fullname: 'Super Admin',
        username: 'sadmin',
        password: 'Sadmin123*',
        role: 'Super Admin'
    };

    var _init = function(){
        UserModel.findOne({username: superAdmin.username},
            function(error, data){
                if(error){
                    console.log("Error findOne: " + error);
                }else {
                    if(data === null){
                        UserModel.register(new UserModel(superAdmin),
                            superAdmin.password,
                            function(err, account){
                                if(err){
                                    console.log("Error Create: " + err);
                                    return;
                                }
                                return;
                            }
                        )
                    }
                }
            }
        );
    };

    function UserRoute(){
        this.getUser = __bind(this.getUser, this);
        this.getUsers = __bind(this.getUsers, this);
        this.saveUser = __bind(this.saveUser, this);
        _init();
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
        var filter = request.query;
        var query = UserModel
            .find(filter)
            .select('_id name lastname fullname username role');
        query.exec(function(error, data) {
            if (error) {
                response.status(500).json(error.message);
            } else {
                var index = 0;
                for(index; index < data.length; index++){
                    if(data[index].username === 'sadmin') {
                        data.splice(index, 1);
                        break;
                    }
                }
                response.status(200).json({data: data});
            }
        });
    };

    UserRoute.prototype.saveUser = function(request, response){
        var newUser;
        newUser = {
            username: request.body.user.username,
            name: request.body.user.name,
            lastname: request.body.user.lastname,
            fullname: request.body.user.name + ' ' + request.body.user.lastname,
            role: request.body.user.role
        };

        UserModel.register(new UserModel(newUser), request.body.user.password,
            function(err, account) {
                if (err) {
                    response.status(500).json(err.message);
                } else {
                    response.status(201).json(account);
                }
        });
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
                    if(error.code){
                        response.status(error.code).json(error.message);
                    } else {
                        response.status(500).json(error.message);
                    }
                }
                else{
                    for(var key in newDataUser){
                        if(typeof(user[key]) !== 'undefined'){
                            user[key] = newDataUser[key];
                        }
                    }
                    user.save(function(err, userUpdated){
                        if(err){
                            if(err.code){
                                response.status(err.code).json(err.message);
                            } else {
                                response.status(500).json(err.message);
                            }
                        }
                        else{
                            response.status(200).json(userUpdated);
                        }
                    })
                }
            });
        }else {
            response.status(400).json('Bad request');
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
