advcApp.controller('menuCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams){
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
            },
            {
                name: 'Usuario',
                href: '/listUser'
            }
        ];
        $scope.selectedItem = {name: 'Hola Mundo'};

        $scope.configItems =[
            {
                name: 'Crear Usuario',
                href: '/createUser'
            },
            {
                name: 'Editar Usuario',
                href: '/editUser'
            }
        ]
        $scope.configSelectedItem = $scope.configItems[0];

        $scope.changeSelectedConfig = function(index){
            $scope.configSelectedItem = $scope.configItems[index];
        };
    }
]);