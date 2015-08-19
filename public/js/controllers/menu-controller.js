advcApp.controller('menuCtrl', ['$scope', '$http', '$route', '$routeParams',
    '$location', '$rootScope', 'loginService', 'SessionService', '$rbac',
    '$window',
    function($scope, $http, $route, $routeParams, $location, $rootScope,
             loginService, SessionService, $rbac, $window){
        $scope.userIsAuthenticated = false;
        var isLogged = SessionService.get('logged');
        $scope.mainSelected = false;
        $scope.newsSelected = false;
        var currentSelected = null;

        if($location.$$url === '/mainBoard'){
            $scope.mainSelected = true;
            currentSelected = 'main';
        }else if($location.$$url === '/index'){
            $scope.newsSelected = true;
            currentSelected = 'news';
        }

        $scope.items = [
            {
                name: 'Usuarios',
                href: '/listUser',
                allow: "Menu.Users.Execute",
                selected: false
            },
            {
                name: 'Clubs',
                href: '/listClubs',
                allow: "Menu.Clubs.Execute",
                selected: false
            },
            {
                name: 'Fichas Medicas',
                href: '/listMedicalRecord',
                allow: "Menu.Medical.Execute",
                selected: false
            },
            {
                name: 'Campeonatos',
                href: '/listChampionship',
                allow: "Menu.Champ.Execute",
                selected: false
            },
            {
                name: 'Transferencias',
                href: '/listTransfers',
                allow: "Menu.ListTransfers.Execute",
                selected: false
            },
            {
                name: 'Cuenta',
                href: '/changePassword',
                allow: "Menu.Change.Execute",
                selected: false
            }
        ];
        $rootScope.$on('userAuthenticated', function(event, booleanData) {
            $scope.userIsAuthenticated = booleanData;
            $scope.loggedUser = SessionService.get('user');
            $scope.userId = SessionService.get('userId');
        });

        $rootScope.$on('changeMenuItem', function(event, menuItem){
            switch(menuItem){
                case 'MainBoard':
                    if(typeof(currentSelected) === 'number'){
                        $scope.items[currentSelected].selected = false;
                    }else {
                        $scope.newsSelected = false;
                    }
                    $scope.mainSelected = true;
                    currentSelected = 'main';
                    break;
                case 'Index':
                    if(typeof(currentSelected) === 'number'){
                        $scope.items[currentSelected].selected = false;
                    }else {
                        $scope.mainSelected = false;
                    }
                    $scope.newsSelected = true;
                    currentSelected = 'news';
                    break;
                case 'ListUser':
                    if(typeof(currentSelected) === 'number'){
                        $scope.items[currentSelected].selected = false;
                    }else {
                        $scope.mainSelected = false;
                        $scope.newsSelected = false;
                    }
                    $scope.items[0].selected = true;
                    currentSelected = 0;
                    break;
                case 'ListClubs':
                case 'ClubInfo':
                case 'Kardex':
                    if(typeof(currentSelected) === 'number'){
                        $scope.items[currentSelected].selected = false;
                    }else {
                        $scope.mainSelected = false;
                        $scope.newsSelected = false;
                    }
                    $scope.items[1].selected = true;
                    currentSelected = 1;
                    break;
                case 'ListMedicalRecord':
                    if(typeof(currentSelected) === 'number'){
                        $scope.items[currentSelected].selected = false;
                    }else {
                        $scope.mainSelected = false;
                        $scope.newsSelected = false;
                    }
                    $scope.items[2].selected = true;
                    currentSelected = 2;
                    break;
                case 'ListChampionship':
                    if(typeof(currentSelected) === 'number'){
                        $scope.items[currentSelected].selected = false;
                    }else {
                        $scope.mainSelected = false;
                        $scope.newsSelected = false;
                    }
                    $scope.items[3].selected = true;
                    currentSelected = 3;
                    break;
                case 'ListTransfers':
                    if(typeof(currentSelected) === 'number'){
                        $scope.items[currentSelected].selected = false;
                    }else {
                        $scope.mainSelected = false;
                        $scope.newsSelected = false;
                    }
                    $scope.items[4].selected = true;
                    currentSelected = 4;
                    break;
                case 'ChangePassword':
                    if(typeof(currentSelected) === 'number'){
                        $scope.items[currentSelected].selected = false;
                    }else {
                        $scope.mainSelected = false;
                        $scope.newsSelected = false;
                    }
                    $scope.items[5].selected = true;
                    currentSelected = 5;
                    break;
            }
        });

        if(isLogged) {
            $scope.userIsAuthenticated = true;
            $scope.loggedUser = SessionService.get('user');
            $scope.userId = SessionService.get('userId');
        }

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