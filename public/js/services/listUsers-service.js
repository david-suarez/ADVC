advcApp.factory('listUsersSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/users/:user_id',
        { user_id: '@user_id' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }

    );
}]);
