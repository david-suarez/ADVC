// Base routes for the web site application
var BASE_HOME_ROUTE = "/";
var BASE_MAIN_BOARD_ROUTE = "/mainBoard";
var BASE_PLAYERS_ROUTE = "/players";
var BASE_USERS_ROUTE = "/users";
var BASE_PARTIAL_VIEW = "/partials";
var BASE_UNAUTHORIZED_ROUTE = "/unauthorized";

/*
Routes for the web site application
@example Routes
/
/partials/clubs
    ...
/partials/notFound
*/
exports.HomeRoute = BASE_HOME_ROUTE;
exports.MainBoardRoute = BASE_MAIN_BOARD_ROUTE;
exports.PersonsRoute = BASE_PLAYERS_ROUTE;
exports.VisitorsRoute = BASE_USERS_ROUTE;
exports.PartialViewsRoute = BASE_PARTIAL_VIEW + "/:partialView";
exports.Unauthorized = BASE_UNAUTHORIZED_ROUTE;