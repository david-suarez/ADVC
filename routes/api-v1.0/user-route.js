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
        this.model = UserModel;
    }

    UserRoute.prototype.getUser = function(request, response){
        var user_id = request.params.user_id;
        this.model.findById(user_id, function(error, data) {
            if(error){
                response.json('500', error.message);
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
            console.log(data[0].name);
            console.log(data[0].lastname);
            if (error) {
                response.json('500', error.message);
            } else {
                response.json('200', data);
            }
        });
    };

    UserRoute.prototype.saveUser = function(request, response){
        var newUser;
        newUser = request.body.user;
        if(newUser !== undefined) {
            this.model.create(newUser, function (error, data) {
                if (error) {
                    response.json('500', error.message);
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
