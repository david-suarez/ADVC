advcApp.controller('mainCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams){
        $scope.haveProfile = true;
        $scope.mainPublications = [
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
        $scope.publications = [
            {
                class: 'generic-card',
                template: '<div> Hola </div>'
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