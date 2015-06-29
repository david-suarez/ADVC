'use strict';
advcApp.service('loginService', ['$resource',
    function($resource){
        return $resource('/login');
    }
]);