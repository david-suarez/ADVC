advcApp.controller('listPlayersCtrl', ['$scope', '$routeParams',
    '$location', 'listPlayersSrv', '$modal',
    function($scope, $routeParams, $location, listPlayersSrv, $modal) {
        $scope.filteredPlayers = {};
        $scope.closeAlert = function () {
            $scope.reason = null;
        };
        $scope.open = function () {
            var modalInstance = $modal.open({
                templateUrl: 'partials/wizard.html',
                controller: 'ModalCtrl',
                controllerAs: 'modal'
            });

            modalInstance.result
                .then(function (data) {
                    $scope.closeAlert();
                    $scope.summary = data;
                }, function (reason) {
                    $scope.reason = reason;
                });
        };
        listPlayersSrv.get({},
            function(result){
                $scope.filteredPlayers = result.data;
            },
            function(error){
                console.log(error);
            }
        );
    }
]);
