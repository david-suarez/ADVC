'use strict';
advcApp.service('SessionService', ["$http", function($http) {
    return {

        //get a variable with 'key' key
        get: function(key) {
            return sessionStorage.getItem(key);
        },
        //set a variable with 'key' key and 'value' value
        set: function(key, val) {
            return sessionStorage.setItem(key, val);
        },
        //unset the variable with 'key' key
        unset: function(key) {
            return sessionStorage.removeItem(key);
        },
        //clear all session variables
        unsetAll: function() {
            sessionStorage.clear();
        },
        //call server /logout route 
        logoutServer: function() {
            $http({method: 'GET', url: '/logout'}).
                success(function(data, status, headers, config) {
                }).
                error(function(data, status, headers, config) {
                    alert('Ocurrio un error en la función de deslogueo.')
                });
        }
    };
}]);
