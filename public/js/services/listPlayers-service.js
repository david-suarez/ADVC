advcApp.factory('listPlayersSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/players/:playerId',
        { playerId: '@playerId' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }
    );
}]);

