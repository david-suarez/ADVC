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
                selected: true,
                colorlistPlayers: {
                    code: 'color6'
                }
            },
            '2',
            '3']
        $scope.filteredPlayers = [
            {
                fullName: 'David Suarez Aliendre'
            },
            {
                fullName: 'Bhavanna Ruth Palomino Pardo'
            },
            {
                fullName: 'Adriana Meliz Berrios Arnez'
            },
            {
                fullName: 'Mariano Antonio Melgarejo Salvatierra'
            }
        ]
    }
]);