var apiRoutes = require('./api-v0.1');
var appRoutes = require('./app');

/*
   Implements the routes to use the services, and this lets you implements as
   many versions as you want.
   @param [express] app
   @example:
   api* = require './api*'
   api* app
*/
module.exports = function(app, mongoose){
    // Initialize routes for the application
    appRoutes(app);

    // Initialize routes for REST api v0.1
    apiRoutes(app);
};
