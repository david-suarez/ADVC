var UserRoutes = require('./user-route');
var TeamRoutes = require('./team-route');
var PlayerRoutes = require('./player-route');
var ClubRoutes = require('./club-route');

module.exports = function(app){
    UserRoutes(app);
    TeamRoutes(app);
    PlayerRoutes(app);
    ClubRoutes(app);
};
