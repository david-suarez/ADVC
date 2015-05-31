var HomeRoutes = require ('./home-route');
//var MainBoardRoute = require ('./main-board-route');
var PartialViewRoute = require ('./partial-view-route');
//var ExceptionRoute = require ("./exception-routes");

/*
Setting the Web Site Application Routes to the server
@param [Object] app is an instance of express application
*/
var settingAppRoutes = function(app) {
    HomeRoutes(app);
    //MainBoardRoute(app);
    PartialViewRoute(app);
    //ExceptionRoute(app);
};

module.exports = settingAppRoutes;