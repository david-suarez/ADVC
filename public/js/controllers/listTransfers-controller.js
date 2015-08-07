advcApp.controller('listTransfersCtrl', ['$scope', '$routeParams',
    '$location','listTransfersSrv','listPlayersSrv',
    function($scope, $routeParams, $location, listTransfersSrv,
             listPlayersSrv) {
        $scope.newTransfer = {};
        $scope.Players = {};
        $scope.format = 'dd/MM/yyyy';
        $scope.formName = '';

        $scope.formCreateTransfer = function () {
            $scope.newTransfer = {};
            $scope.createMode = true;
            $scope.editMode = false;
            $scope.formName = 'Formulario de Transferecias';
        };
    }
]);