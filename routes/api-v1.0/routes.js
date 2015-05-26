var VERSION = '/v0.1';
var API = '/api' + VERSION;
var BASE_USER_ROUTE = '/users';
var BASE_PLAYER_ROUTE = '/players';
var BASE_TEAM_ROUTE = '/teams';
var BASE_CLUB_ROUTE = '/clubs';
var BASE_KARDEX_ROUTE = '/kardex';

/*
 Api for Users
 @example define routes for users
 /api/v0.1/users
 /api/v0.1/users/:user_id
 */
var USERS_ROUTE = API + BASE_USER_ROUTE;

exports.UsersRoute = USERS_ROUTE;
exports.UserRoute = USERS_ROUTE + '/:user_id';

/*
 Api for Players
 @example define routes for players
 /api/v0.1/players
 /api/v0.1/players/:player_id
*/

var PLAYER_ROUTE = API + BASE_PLAYER_ROUTE;

exports.Player_Route = PLAYER_ROUTE;

/*
 Api for Teams
 @example define routes for teams
 /api/v0.1/teams
 /api/v0.1/teams/:team_id
*/

var TEAM_ROUTE = API + BASE_TEAM_ROUTE;

exports.TeamsRoute = TEAM_ROUTE;
exports.TeamRoute = TEAM_ROUTE + '/:team_id';

/*
 Api for Clubs
 @example define routes for clubs
 /api/v0.1/clubs
 /api/v0.1/teams/:club_id
*/

var CLUB_ROUTE = API + BASE_CLUB_ROUTE;

exports.Club_Route = CLUB_ROUTE;
/*
 Api for Kardex
 @example define routes for kardex
 /api/v0.1/kardex
 /api/v0.1/kardex/:kadex_id
*/

var KADEX_ROUTE = API + BASE_KARDEX_ROUTE;

exports.Kardex_Route = KADEX_ROUTE;
