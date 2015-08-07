advcApp.factory('changePassSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/users/changePass/:user_id',
        { user_id: '@user_id' },
        {
            'update': { method: 'PUT' }
        }
    );
}]);