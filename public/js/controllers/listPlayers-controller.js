advcApp.controller('listPlayersCtrl', ['$scope', '$routeParams',
    '$location', 'listPlayersSrv',
    function($scope, $routeParams, $location, listPlayersSrv) {
        $scope.Players = {};
        listPlayersSrv.get({},
            function(result){
                $scope.Players = result.data;
            },
            function(error){
                console.log(error);
            }
        );
    }
]);
