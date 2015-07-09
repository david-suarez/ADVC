/*
 *  This service obtains data of
 *  data base for the publication table.
 */
advcApp.factory('publicationSrv', ['$resource', function($resource){
    return $resource('api/v0.1/publications/:publicationId',
        { publicationId: '@publicationId' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }
    );
}]);