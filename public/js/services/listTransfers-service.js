advcApp.factory('listTransfersSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/transfers/:transfersId',
        { transfersId: '@transfersId' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' }
        }
    );
}]);
