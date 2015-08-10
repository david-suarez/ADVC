advcApp.factory('configSrv', ['$resource', function($resource){
    return $resource('config/config.json',{ }, {
        getData: {method:'GET', isArray: false}
    });
}]);
