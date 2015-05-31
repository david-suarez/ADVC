var route = require('./routes');

var __bind = function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var HomeRoute = (function(){

    function HomeRoute(){
        this.getHomeRoute = __bind(this.getHomeRoute, this);
    }

    HomeRoute.prototype.getHomeRoute = function(request, response){
        var view = 'layout';
        response.render(view);
    };
    return HomeRoute;
})();

module.exports = function(app){
    var homeRoute;
    homeRoute = new HomeRoute(app);
    app.get(route.HomeRoute, homeRoute.getHomeRoute);
};