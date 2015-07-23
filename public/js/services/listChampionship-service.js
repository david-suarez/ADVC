advcApp.factory('listChampionshipSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/championships/:championshipId',
        { championshipId: '@championshipId' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }
    );
}]);

