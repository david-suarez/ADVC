advcApp.factory('listTeamSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/teams/:team_id',
        { team_id: '@team_id' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }
    );
}]);