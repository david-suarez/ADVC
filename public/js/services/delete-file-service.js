'use strict';
advcApp.service('deleteFileSrv', ['$resource',
    function($resource){
        return $resource('api/v0.1/publications/:publicationId/filedelete',
            { publicationId: '@publicationId' },
            {
                'delete': { method: 'POST' }
            }
        );
    }
]);