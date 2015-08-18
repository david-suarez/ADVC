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
        //get is a user is authenticated to the app
        isAuthenticated: function() {
            var userlogged = sessionStorage.getItem('logged');
            return userlogged;
        },
        //call server /logout route 
        logoutServer: function() {
            $http.get('/logout');
        }

    };
}]);
