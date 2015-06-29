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
                templateUrl:'partials/index',
                controller:'mainCtrl'
            }
        ).when("/mainBoard",
            {
                templateUrl: 'partials/boardView',
                controller: "boardCtrl"
            }
        ).when("/listUser",
            {
                templateUrl: 'partials/listUser',
                controller: "listUsersCtrl"
            }
        ).when('/login',
            {
                templateUrl : 'partials/login_view.html',
                controller : 'loginCtrl'
            }
        ).otherwise(
            {
                redirectTo: "/index"
            }
        );
        //$locationProvider.html5Mode(true);
}]);