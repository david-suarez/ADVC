advcApp.factory('listClubsSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/clubs/:clubId',
        { clubId: '@clubId' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }
    );
}]);

