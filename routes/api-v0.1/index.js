var UserRoutes = require('./user-route');
var TeamRoutes = require('./team-route');
var PlayerRoutes = require('./player-route');
var ClubRoutes = require('./club-route');
var LoginRoutes = require('./login-route');
var PublicationRoutes = require('./publication-route');
var MedicalRecordRoutes = require('./medical-record-route');
var ChampionshipRoutes = require('./championship-route');

module.exports = function(app){
    UserRoutes(app);
    TeamRoutes(app);
    PlayerRoutes(app);
    ClubRoutes(app);
    LoginRoutes(app);
    PublicationRoutes(app);
    MedicalRecordRoutes(app);
    ChampionshipRoutes(app);
};
