var appRoutes = require('./api-v1.0');

module.exports = function(app, mongoose){
    appRoutes(app);
};
