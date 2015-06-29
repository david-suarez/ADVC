advcApp.controller('menuCtrl', ['$scope', '$http', '$routeParams', '$location',
    '$rootScope', 'loginService', 'SessionService',
    function($scope, $http, $routeParams, $location, $rootScope,
             loginService, SessionService ){
        $scope.userIsAuthenticated = false;
        if(SessionService.get('logged')) {
            $scope.userIsAuthenticated = true;
            $scope.loggedUser = SessionService.get('user');
            $scope.idUser = SessionService.get('idUser');
        }

        $scope.items = [
            {
                name: 'Principal',
                srcIcon: 'icon-main',
                href: '/cualquiercosa',
                allow: "Menu.MainBoard.Execute"
            },
            {
                name: 'Main - board',
                srcIcon: 'icon-main',
                href: '/mainBoard',
                allow: "Menu.MainBoard.Execute"
            }
        ];
        $rootScope.$on('userAuthenticated', function(event, booleanData) {
            $scope.userIsAuthenticated = booleanData;
        });
        $scope.selectedItem = $scope.items[0];
        $scope.autenticate = {
            login: 'Iniciar Sesion',
            logout: 'Cerrar Sesion',
            href: '/login'
        };
        $scope.User = {};

        /**
         *   This method kills the current user session
         */
        $scope.goToLogoutPage = function() {
            var r = confirm("Esta seguro que desea cerrar sesion?");
            if (r == true) {
                SessionService.unsetAll('logged');
                $rootScope.$emit('userAuthenticated', false);
                $location.path('/index');
            }
        };

        $scope.changeSelectedItem = function(index){
            $scope.selectedItem = $scope.items[index];
        }
    }
]);