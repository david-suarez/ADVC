advcApp.controller('mainCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams){
        $scope.haveProfile = true;
        $scope.cards = [
            {
                class: 'generic-card'
            },
            {
                class: 'generic-card'
            },
            {
                class: 'generic-card'
            },
            {
                class: 'generic-card'
            },
            {
                class: 'generic-card'
            },
            {
                class: 'generic-card'
            },
            {
                class: 'generic-card'
            }
        ]

    }
]);