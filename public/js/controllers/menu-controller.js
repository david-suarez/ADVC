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
            }
        ];
        $scope.selectedItem = {name: 'Hola Mundo'};
    }
]);