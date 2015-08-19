'use strict';
var advcApp;
advcApp = angular.module(
    "advcApp",
    [
        'ngRoute',
        'ngResource',
        'rbac',
        'ngAnimate',
        'ui.bootstrap',
        'ngDragDrop'
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
                templateUrl: 'partials/boardView'
            }
        ).when("/listUser",
            {
                templateUrl: 'partials/listUser',
                controller: "listUsersCtrl"
            }
        ).when('/login',
            {
                templateUrl: 'partials/login_view.html',
                controller: 'loginCtrl'
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
        ).when("/listTransfers",
            {
                templateUrl: 'partials/listTransfers',
                controller: "listTransfersCtrl"
            }
        ).when("/changePassword",
            {
                templateUrl: 'partials/changePassword',
                controller: "changePasswordCtrl"
            }
        ).when("/listClubs/:clubName/:clubId/clubInfo",
            {
                templateUrl: 'partials/clubInfo',
                controller: 'listTeamsCtrl'
            }
        ).when("/listClubs/:clubName/:clubId/players/:playerId/kardex",
            {
                templateUrl: 'partials/kardexPlayer',
                controller: 'listPlayersCtrl'
            }
        ).otherwise(
            {
                redirectTo: "/mainBoard"
            }
        );
        //$locationProvider.html5Mode(true);
}]);

advcApp.run([
    '$rootScope', '$location', 'SessionService', '$rbac',
    function($rootScope, $location, SessionService, $rbac) {
        return $rootScope.$on(
            "$routeChangeStart",
            function(event, next, current) {
                var nextPage = "";
                if (next.originalPath != null) {
                    var indexName = next.originalPath.lastIndexOf("/")
                        + 1;
                    nextPage = next.originalPath.slice(indexName,
                        next.originalPath.length);

                    nextPage = nextPage.charAt(0).toUpperCase() +
                        nextPage.slice(1);
                    $rootScope.$emit('changeMenuItem', nextPage);
                }
                if (SessionService.isAuthenticated()) {
                    var isUser = SessionService.get('idUSer');
                    $rbac.checkAccess(isUser).then(function(){
                        if(!$rbac.allow('ListClubs')) {
                            var logout = true;
                            if($rbac.allow('MedicalPermission'))
                                logout = false;
                            if(logout){
                                $rbac.reset();
                                SessionService.unsetAll('logged');
                                $rootScope.$emit('userAuthenticated', false);
                                $.noty.consumeAlert({layout: 'topCenter',
                                    type: 'warning', dismissQueue: true ,
                                    timeout:2000 });
                                alert('Su sesión expiró. Ingrese sus ' +
                                    'credenciales nuevamente en la pagina' +
                                    ' de autenticación');
                                $.noty.stopConsumeAlert();
                            }
                        }
                        if (!$rbac.allow(nextPage)) {
                            $location.path('/mainBoard');
                        }

                    });
                } else {
                    if(!$rbac.allow('ListClubs') ||
                        !$rbac.allow('ListMedicalRecord')){
                        $rbac.reset();
                        SessionService.unsetAll('logged');
                        $rootScope.$emit('userAuthenticated', false);
                    }
                    $rbac.checkAccess(null).then(function() {
                        var nextPage = "";
                        if (next.originalPath != null) {
                            var indexName = next.originalPath.lastIndexOf("/")
                                + 1;
                            nextPage = next.originalPath.slice(indexName,
                                next.originalPath.length);
                            nextPage = nextPage.charAt(0).toUpperCase() +
                                nextPage.slice(1);
                            if (!$rbac.allow(nextPage)) {
                                $location.path('/mainBoard');
                            }
                        }
                    });
                }
        });
    }
]);

advcApp.config([
    "$rbacProvider", function($rbacProvider) {
        return $rbacProvider.setup({
            url: "/api/v0.1/rbac",
            scopeName: "rbac"
        });
    }
]);
