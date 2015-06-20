advcApp.controller('menuCtrl', ['$scope', '$http', '$routeParams', '$location', 'loginService',
    function($scope, $http, $routeParams, $location, loginService ){
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
        $scope.userIsAuthenticated = false;
        $scope.selectedItem = $scope.items[0];
        $scope.autenticate = {
            login: 'Iniciar Sesion',
            logout: 'Cerrar Sesion',
            href: '/login'
        };
        $scope.User = {};

        $scope.changeSelectedItem = function(index){
            $scope.selectedItem = $scope.items[index];
        }
    }
]);