advcApp.controller('menuCtrl', ['$scope', '$http', '$routeParams', 'loginService',
    function($scope, $http, $routeParams, loginService){
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

        $scope.User = {};
        $scope.loginSystem = function(){
            //console.log("200");
            var resp = loginService.entrySystem($scope.User).then(function(response){
                if(response.success){
                    $location.path('/login');
                };
            });
        };
    }
]);