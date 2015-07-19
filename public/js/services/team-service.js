advcApp.factory('listTeamSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/teams/:teamId',
        { teamId: '@teamId' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }
    );
}]);