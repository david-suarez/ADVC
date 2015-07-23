'use strict';
var advcApp;
advcApp = angular.module(
    "advcApp",
    [
        'ngRoute',
        'ngResource',
        'ui.bootstrap'
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
        ).when("/listClubs",
            {
                templateUrl: 'partials/listClubs',
                controller: "listClubsCtrl"
            }
        ).when("/listClubs/:clubName/:clubId/listTeams",
            {
                templateUrl: 'partials/listTeam',
                controller: 'listTeamsCtrl'
            }
        ).when("/listMedicalRecord",
            {
                templateUrl: 'partials/listMedicalRecord',
                controller: "listMedicalRecordCtrl"
            }
        ).when("/listChampionship",
            {
                templateUrl: 'partials/listChampionship',
                controller: "listChampionshipCtrl"
            }
        ).otherwise(
            {
                redirectTo: "/index"
            }
        );
        //$locationProvider.html5Mode(true);
}]);