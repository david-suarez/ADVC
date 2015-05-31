'use strict';
var advcApp = angular.module(
    "advcApp",
    [
        "ngRoute",
        "ngResource",
        "ui.bootstrap"
    ]
);

// Sets the URL routes for partial views
advcApp.config(["$routeProvider",
    function($routeProvider){
        $routeProvider
        .when("/index",
            {
                templateUrl:'partials/index'
            }
        ).when("/mainBoard",
            {
                template: 'partials/boardView',
                controller: "boardCtrl"
            }
        ).otherwise(
            {
                redirectTo: "/index"
            }
        );
        //$locationProvider.html5Mode(true);
}]);