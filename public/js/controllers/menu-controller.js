advcApp.controller('menuCtrl', ['$scope', '$http', '$route', '$routeParams',
    '$location', '$rootScope', 'loginService', 'SessionService', '$rbac',
    '$window',
    function($scope, $http, $route, $routeParams, $location, $rootScope,
             loginService, SessionService, $rbac, $window){
        $scope.userIsAuthenticated = false;
        if(SessionService.get('logged')) {
            $scope.userIsAuthenticated = true;
            $scope.loggedUser = SessionService.get('user');
            $scope.userId = SessionService.get('userId');
        }

        $scope.items = [
            {
                name: 'Usuarios',
                href: '/listUser',
                allow: "Menu.Users.Execute"
            },
            {
                name: 'Clubs',
                href: '/listClubs',
                allow: "Menu.Clubs.Execute"
            },
            {
                name: 'Fichas Medicas',
                href: '/listMedicalRecord'
            },
            {
                name: 'Campeonatos',
                href: '/listChampionship'
            }

        ];
        $rootScope.$on('userAuthenticated', function(event, booleanData) {
            $scope.userIsAuthenticated = booleanData;
            $scope.loggedUser = SessionService.get('user');
            $scope.userId = SessionService.get('userId');
        });

        $scope.getCurrentItem = function(currentUrl) {
            var item, _i, _len, _ref1;
            _ref1 = $scope.items;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                item = _ref1[_i];
                if (item.href === currentUrl) {
                    return item = {
                        name: item.name,
                        src: item.srcIcon
                    };
                }
            }
        };

        $scope.selectedItem = $scope.getCurrentItem($location.path());

        $scope.setSelectedItem = function(item) {
            console.log(item);
            return $scope.selectedItem = item;
        };

        $scope.$on('$locationChangeSuccess', function(event) {
            var item;
            item = $scope.getCurrentItem($location.path());
            $scope.selectedItem = item;
        });

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
                $rbac.reset();
                SessionService.unsetAll('logged');
                SessionService.logoutServer();
                $rootScope.$emit('userAuthenticated', false);
                $window.location.reload();
                $scope.loggedUser = '';
                $scope.userId = false;
                $location.path('/mainBoard');
            }
        };

        $scope.changeSelectedItem = function(index){
            $scope.selectedItem = $scope.items[index];
        };
    }
]);