var route = require('./routes');

var __bind = function(fn, me){
    return function(){
        return fn.apply(me, arguments);
    };
};

var PartialViewRoute = (function(){

    function PartialViewRoute(){
        this.getPartialViews = __bind(this.getPartialViews, this);
    }

    PartialViewRoute.prototype.getPartialViews = function(request, response){
        var partialView = "partials/" + request.params.partialView;
        console.log(partialView);
        response.render(partialView);
    };

    return PartialViewRoute;
})();

module.exports = function(app){
    var partialRoute;
    partialRoute = new PartialViewRoute(app);
   app.get(route.PartialViewsRoute, partialRoute.getPartialViews);
};