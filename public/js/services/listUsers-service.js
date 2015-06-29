advcApp.factory('listUsersSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/users/:userId',
        { userId: '@userId' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }
    );
}]);
