advcApp.controller('mainCtrl', ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams){
        $scope.isExpanded = true;
        $scope.showModal = false;
        $scope.openCreateDialog = function(){
            $scope.showModal = !$scope.showModal;
        };

        $scope.publications = [
            {
                class: 'generic-card',
                name: 'ONE',
                type: 'secondary'
            },
            {
                class: 'generic-card',
                name: 'TWO',
                type: 'main'
            },
            {
                class: 'generic-card',
                name: 'THREE',
                type: 'secondary'
            },
            {
                class: 'generic-card',
                name: 'FOUR',
                type: 'main'
            },
            {
                class: 'generic-card',
                name: 'FIVE',
                type: 'secondary'
            },
            {
                class: 'generic-card',
                name: 'SIX',
                type: 'main'
            },
            {
                class: 'generic-card',
                name: 'SEVEN',
                type: 'main'
            }
        ]
    }
]);