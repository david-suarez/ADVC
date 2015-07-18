advcApp.controller('menuCtrl', ['$scope', '$http', '$routeParams', '$location',
    '$rootScope', 'loginService', 'SessionService',
    function($scope, $http, $routeParams, $location, $rootScope,
             loginService, SessionService ){
        $scope.userIsAuthenticated = false;
        if(SessionService.get('logged')) {
            $scope.userIsAuthenticated = true;
            $scope.loggedUser = SessionService.get('user');
            $scope.userId = SessionService.get('userId');
        }

        $scope.items = [
            {
                name: 'Principal',
                srcIcon: 'icon-main',
                href: '/index',
                allow: "Menu.MainBoard.Execute"
            },
            {
                name: 'Main - board',
                srcIcon: 'icon-main',
                href: '/mainBoard',
                allow: "Menu.MainBoard.Execute"
            },
            {
                name: 'Usuarios',
                href: '/listUser'
            },
            {
                name: 'Clubs',
                href: '/listClubs'
            },
            {
                name: 'Fichas Medicas',
                href: '/listMedicalRecord'
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
                SessionService.unsetAll('logged');
                $rootScope.$emit('userAuthenticated', false);
                $scope.loggedUser = '';
                $scope.userId = false;
                $location.path('/index');
            }
        };

        $scope.changeSelectedItem = function(index){
            $scope.selectedItem = $scope.items[index];
        };
    }
]);