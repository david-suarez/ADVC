var route = require('./routes');
var UserModel = require('../../models/user-model');
var Permissions = require ("../../config/permission");
var __bind = function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var LoginRoute = (function(){

    function LoginRoute(){
        this.saveUser = __bind(this.saveUser, this);
        this.model = UserModel;
    }

    LoginRoute.prototype.saveUser = function(request, response){
        var newUser;
        var newPassword;
        newUser = request.body.user_name;
        newPassword = request.body.password;
        UserModel.findOne({user_name: newUser, password: newPassword},function(error,user){
            if (error) {
                response.json('500', error.message);
            } else {
                if (user != undefined)
                {
                    var data = {
                        _id: user._id,
                        fullName: user.name + ' ' + user.lastname
                    };
                    console.log(request.user);
                    response.status(200).json({success:true, user: data});
                }
                else {
                    response.status(404).json({success:false});
                }
            }
        });
    };

    return LoginRoute;
})();

module.exports = function(app) {
    var loginRoute;
    loginRoute = new LoginRoute(app);
    app.post(route.Route_Login, loginRoute.saveUser);
    app.get(route.Route_Login, loginRoute.saveUser);
    app.post(route.Route_Login, loginRoute.saveUser);
};
