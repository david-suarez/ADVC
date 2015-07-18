var VERSION = '/v0.1';
var API = '/api' + VERSION;
var BASE_USER_ROUTE = '/users';
var BASE_ROUTE_LOGIN = '/login';
var BASE_PLAYER_ROUTE = '/players';
var BASE_TEAM_ROUTE = '/teams';
var BASE_CLUB_ROUTE = '/clubs';
var BASE_KARDEX_ROUTE = '/kardex';
var BASE_PUB_ROUTE = '/publications';
var BASE_MEDICAL_ROUTE = '/medicals';

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

exports.Route_Login = BASE_ROUTE_LOGIN;


var PLAYER_ROUTE = API + BASE_PLAYER_ROUTE;

exports.Player_Route = PLAYER_ROUTE + '/:player_id';
exports.Players_Route = PLAYER_ROUTE;
/*
 Api for Teams
 @example define routes for teams
 /api/v0.1/teams
 /api/v0.1/teams/:teamId
*/

var TEAM_ROUTE = API + BASE_TEAM_ROUTE;

exports.TeamsRoute = TEAM_ROUTE;
exports.TeamRoute = TEAM_ROUTE + '/:teamId';

/*
 Api for Clubs
 @example define routes for clubs
 /api/v0.1/clubs
 /api/v0.1/teams/:club_id
*/

var CLUB_ROUTE = API + BASE_CLUB_ROUTE;

exports.ClubsRoute = CLUB_ROUTE;
exports.ClubRoute = CLUB_ROUTE + '/:clubId';

/*
 Api for Kardex
 @example define routes for kardex
 /api/v0.1/kardex
 /api/v0.1/kardex/:kadex_id
*/

var KADEX_ROUTE = API + BASE_KARDEX_ROUTE;

exports.Kardex_Route = KADEX_ROUTE;

/*
 Api for Publications
 @example define routes for kardex
 /api/v0.1/publications
 /api/v0.1/publications/:publication_id
*/

var MEDICAL_ROUTE = API + BASE_MEDICAL_ROUTE;

exports.MedicalRecordsRoute = MEDICAL_ROUTE;
exports.MedicalRecordRoute = MEDICAL_ROUTE + '/:medicalRecordId';

/*
 Api for Kardex
 @example define routes for kardex
 /api/v0.1/kardex
 /api/v0.1/kardex/:kadex_id
 */


var PUB_ROUTE = API + BASE_PUB_ROUTE;

exports.PubsRoute = PUB_ROUTE;
exports.PubRoute = PUB_ROUTE + '/:publicationId';
exports.PubUploadFile = PUB_ROUTE + '/fileupload';
exports.PubDeleteFile = PUB_ROUTE + '/:publicationId/filedelete';
