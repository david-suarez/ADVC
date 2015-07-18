advcApp.factory('listMedicalRecordSrv', ['$resource', function($resource){
    return $resource('/api/v0.1/medicals/:medicalId',
        { medicalId: '@medicalId' },
        {
            'get': { method: 'GET' },
            'save': { method: 'POST' },
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        }
    );
}]);

