var UserRoutes = require('./user-route');
var TeamRoutes = require('./team-route');

module.exports = function(app){
    UserRoutes(app);
    TeamRoutes(app);
};