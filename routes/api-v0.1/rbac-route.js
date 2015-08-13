
var route = require('./routes');
var Permissions = require ("../../config/permission");

var __bind =function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var RBACRoute = (function () {

    function RBACRoute (){
        var self = this;
        this.getAccessPermissions = __bind(this.getAccessPermissions, this);
    }

    RBACRoute.prototype.getAccessPermissions = function (request, response){
        var permissions, user;
        permissions = void 0;
        user = request.user ? request.user.role : 'Annonimus';
        if (user) {
            permissions = Permissions[user];
        }
        return response.json(permissions);
    };

    return RBACRoute;
})();

module.exports = function(app){
    var rbacRoute = new RBACRoute();
    return app.post(route.RbacRoute, rbacRoute.getAccessPermissions);
};