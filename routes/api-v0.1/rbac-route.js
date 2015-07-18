
var route = require('./routes');
var Permissions = require ("../../config/permission");
var UserModel = require('../../models/user-model');

var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var RBACRoute = (function () {

    function RBACRoute (){
        var self = this;
        this.getAccessPermissions = __bind(this.getAccessPermissions, this);
        this.users = {};
        var query = UserModel.find().select('_id role');
        //query.sort(sortBy);
        query.exec(function(error, data) {
            if (error) {
                console.error(error);
            } else {
                data.forEach(function(val, index){
                    self.users[val._id] = { role: val.role }
                });
            }
        });
    }

    RBACRoute.prototype.getAccessPermissions = function (request, response){
        var permissions, role, user;
        permissions = void 0;
        user = request.user ? request.user : '';
        console.log(request.user);
        if (this.users[user]) {
            role = this.users[user].role;
            console.log(user);
            console.log(Permissions);
            permissions = Permissions[role];
        }
        console.log(permissions);
        return response.json(permissions);
    };

    return RBACRoute;
})();

module.exports = function(app){
    var rbacRoute = new RBACRoute();
    return app.post(route.RbacRoute, rbacRoute.getAccessPermissions);
};