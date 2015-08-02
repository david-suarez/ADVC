advcApp.controller('clubInfoCtrl', ['$scope', '$routeParams', 'SessionService',
    function($scope, $routeParams, SessionService){
        $scope.clubName = 'Independiente';
        $scope.teams = [
            {
                name: 'Team1',
                players:['1'],
                color: {
                    code: 'color6'
                },
                selected: true
            },
            '2',
            '3'];

    }
]);