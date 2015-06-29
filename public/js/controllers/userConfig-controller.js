advcApp.controller('userConfigCtrl', ['$scope', '$http', '$routeParams', '$location', 'userConfigSrv',

    function($scope, $http, $routeParams, $location, userConfigSrv) {
        $scope.User = {};

        $scope.createUser = function () {
            //console.log($scope.User);
            userConfigSrv.createUser($scope.User).then(function(response){
                console.log(response);
                $scope.User = {};
                //$location.path( "/listUser" );

            });

        }
    }
]);