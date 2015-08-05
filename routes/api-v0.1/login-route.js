var route = require('./routes');
var UserModel = require('../../models/user-model');
var passport = require('passport');
var Permissions = require ("../../config/permission");
var __bind = function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var LoginRoute = (function(){
    function LoginRoute(){
        this.loginUser = __bind(this.loginUser, this);
        this.logoutUser = __bind(this.logoutUser, this);
        this.model = UserModel;
    }

    LoginRoute.prototype.loginUser = function(request, response){
        var newUser;
        newUser = request.body.username;
        request.session.save(function (err) {
            if (err) {
                response.status(500).json(err.message);
            }
            UserModel.findOne({username: newUser},
                function(error, user){
                if (error) {
                    response.json('500', error.message);
                } else {
                    if (user != undefined)
                    {
                        var data = {
                            _id: user._id,
                            fullName: user.fullname,
                            role: user.role,
                            username: user.username
                        };
                        response.status(200).json({success:true, user: data});
                    }
                    else {
                        response.status(404).json({success:false});
                    }
                }
            });
        });
        //var newUser;
        //var newPassword;
        //newUser = request.body.user_name;
        //newPassword = request.body.password;
        //request.session.save(function (err) {
        //    if (err) {
        //        return next(err);
        //    }
        //    res.redirect('/');
        //});
        //
        //UserModel.findOne({user_name: newUser, password: newPassword},function(error,user){
        //    if (error) {
        //        response.json('500', error.message);
        //    } else {
        //        if (user != undefined)
        //        {
        //            var data = {
        //                _id: user._id,
        //                fullName: user.name + ' ' + user.lastname
        //            };
        //            console.log(request.user);
        //            response.status(200).json({success:true, user: data});
        //        }
        //        else {
        //            response.status(404).json({success:false});
        //        }
        //    }
        //});
    };

    LoginRoute.prototype.logoutUser = function(request, response){
        request.logout();
        request.session.save(function (err) {
            if (err) {
                response.status(500).json({ success: false });
            }
            response.status(200).json({ success: true });
        });
    };

    return LoginRoute;
})();

module.exports = function(app) {
    var loginRoute;
    loginRoute = new LoginRoute(app);
    app.get(route.RouteLogout, loginRoute.logoutUser);
    app.post(route.RouteLogin, passport.authenticate('local'),
        loginRoute.loginUser);
};
