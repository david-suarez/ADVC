advcApp.controller('listTransfersCtrl', ['$scope', '$routeParams',
    '$location','SessionService','listTransfersSrv','listPlayersSrv',
    'listClubsSrv',
    function($scope, $routeParams, $location, SessionService, listTransfersSrv,
             listPlayersSrv, listClubsSrv) {
        $scope.Transfers = {};
        $scope.newTransfer = {};
        $scope.Players = [];
        $scope.Clubs = [];
        $scope.format = 'dd/MM/yyyy';
        $scope.formName = '';
        var userRole = SessionService.get('userRole');
        var userId = SessionService.get('userId');
        //var filterclub = {};

        var currentDate = new Date();

        $scope.formCreateTransfer = function () {
            $scope.createMode = true;
            $scope.editMode = false;
            $scope.formName = 'Formulario de Transferencias';
        };

        var restartValidationFields = function(){
            $scope.isNameValid = true;
            $scope.isHeightValid = true;
            $scope.isHomeValid = true;
        };

        listPlayersSrv.get({},
            function(result){
                for(var index in result.data){
                    var player = result.data[index];
                    var fullName = player.name + ' ' + player.lastname;
                    result.data[index].fullName = fullName;
                }
                $scope.Players = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        listClubsSrv.get({},
            function(result){
                $scope.Clubs = result.data;
                for(var index in $scope.Clubs){
                    if($scope.Clubs[index].delegate){
                        if($scope.Clubs[index].delegate._id === userId){
                            $scope.newTransfer.newClub = $scope.Clubs[index];
                            $scope.Clubs.splice(index, 1);
                            break;
                        }
                    }
                }
            },
            function(error){
                console.log(error);
            }
        );

        var obtainTransfers = function() {
            var filterclub = {};
            if(userRole === 'Delegado') {
                filterclub = {
                    delegate: userId,
                    year: currentDate.getFullYear()
                }
            }else {
                filterclub = {year: currentDate.getFullYear()}
            }
            listTransfersSrv.get(filterclub,
                function(result){
                    $scope.Transfers = result.data;
                },
                function(error){
                    console.log(error);
                }
            );
        };

        obtainTransfers();

        $scope.obtainFormatDate = function(date){
            if(date) {
                var requestDate = new Date(date);
                return requestDate.toLocaleDateString();
            }
            return '';
        };

        $scope.createTransfer= function () {
            var newTransfer = {
                player: $scope.newTransfer.player ?
                        $scope.newTransfer.player._id : null,
                originClub: $scope.newTransfer.originClub ?
                            $scope.newTransfer.originClub._id : null,
                newClub: $scope.newTransfer.newClub,
                delegate: userId,
                requestDate: currentDate,
                year : currentDate.getFullYear()
            };
            if ($scope.validateFields()){
                if($scope.newTransfer.originClub._id !==
                    $scope.newTransfer.newClub){
                    listTransfersSrv.save({transfer: newTransfer},
                        function (data) {
                            $scope.Transfers.push(data);
                            restartValidationFields();
                            $('#create-transfer').modal('hide'); //hide modal
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            //$scope.newTransfer = {};
                            $scope.newTransfer.player = {};
                        },
                        function(error){
                            console.log(error);
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'error', dismissQueue: true ,
                                timeout:2000 });
                            alert('ERROR DE DUPLICACION');
                            $.noty.stopConsumeAlert();
                        }
                    );
                }else {
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('Debe seleccionar un club diferente.');
                    $.noty.stopConsumeAlert();
                }
            }
        };

        $scope.closeModal=function(){
            $scope.newTransfer= {};
            restartValidationFields();
        };

        $scope.validateFields = function () {
            var player = $scope.newTransfer.player;
            var originClub = $scope.newTransfer.originClub;
            var newClub = $scope.newTransfer.newClub;
            if(!originClub){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Debe seleccionar el club de origen.');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!player) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('Debe seleccionar un jugador.');
                $.noty.stopConsumeAlert();
                return false;
            } else if(!newClub){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Debe seleccionar el nuevo club.');
                $.noty.stopConsumeAlert();
                return false;
            } else if(newClub === originClub){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('El club de origen tiene que ser diferente al' +
                    ' club destino.');
                $.noty.stopConsumeAlert();
                return false;
            }
            return true;
        };

        $scope.formEditTransfer = function(transfer, indexRecord){
            var index = 0;
            var indexClub = 0;

            for(indexClub; indexClub < $scope.Clubs.length; indexClub++){
                if($scope.Clubs[indexClub]._id === transfer.originClub._id)
                    break;
            }
            for(index; index < $scope.Players.length; index++){
                if($scope.Players[index]._id === transfer.player._id)
                    break;
            }

            $scope.createMode = false;
            $scope.editMode = true;
            $scope.formName = 'Formulario de Edición de Transferencias';
            $scope.newTransfer = {
                originClub: $scope.Clubs[indexClub],
                player: $scope.Players[index],
                index: indexRecord,
                _id: transfer._id
            };
        };

        $scope.editStatusTransfer = function(id, indexRecord){
            var transfersId = id;
            var newDataTransfer = {
                status: 'Transferido'
            };
            listTransfersSrv.update({transfersId: transfersId},
                {transfer: newDataTransfer},
                function (data) {
                    var newDataPlayer = data.newDataPlayer;
                    data.delete('newDataPlayer');
                    $scope.Transfers[indexRecord] = data;
                    for(var index = 0; index < $scope.Players.length; index++){
                        if(newDataPlayer._id === $scope.Players[index]._id){
                            $scope.Players[index] = newDataPlayer;
                            break;
                        }
                    }
                    restartValidationFields();
                    $('#create-transfer').modal('hide'); //hide modal
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                },
                function (error) {
                    $.noty.consumeAlert({
                        layout: 'topCenter',
                        type: 'error', dismissQueue: true,
                        timeout: 2000
                    });
                    alert('Hubo un problema en el servidor. Por favor intente' +
                        ' mas tarde.');
                    $.noty.stopConsumeAlert();
                }
            );
        };

        $scope.editTransfer = function(){
            var indexRecord = $scope.newTransfer.index;
            var transfersId = $scope.newTransfer._id;
            var newDataTransfer = {
                player: $scope.newTransfer.player ?
                        $scope.newTransfer.player._id : null,
                originClub: $scope.newTransfer.originClub ?
                            $scope.newTransfer.originClub._id : null,
                newClub: $scope.newTransfer.newClub ?
                         $scope.newTransfer.newClub : null
            };
            if ($scope.validateFields()) {
                if ($scope.newTransfer.originClub._id !==
                    $scope.newTransfer.newClub) {
                    listTransfersSrv.update({transfersId: transfersId},
                        {transfer: newDataTransfer},
                        function (data) {
                            $scope.Transfers[indexRecord] = data;
                            restartValidationFields();
                            $('#create-transfer').modal('hide'); //hide modal
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                        },
                        function (error) {
                            if(error.code === 409){
                                $.noty.consumeAlert({
                                    layout: 'topCenter',
                                    type: 'error', dismissQueue: true,
                                    timeout: 2000
                                });
                                alert('Error de duplicidad');
                                $.noty.stopConsumeAlert();
                            }else {
                                $.noty.consumeAlert({
                                    layout: 'topCenter',
                                    type: 'warning', dismissQueue: true,
                                    timeout: 2000
                                });
                                alert('Hub un problema en el servidor. Por ' +
                                    'favor intente mas tarde');
                                $.noty.stopConsumeAlert();
                            }

                        }
                    );
                } else {
                    $.noty.consumeAlert({
                        layout: 'topCenter',
                        type: 'warning', dismissQueue: true,
                        timeout: 2000
                    });
                    alert('Debe seleccionar un club diferente.');
                    $.noty.stopConsumeAlert();
                }
            }
        };

        $scope.transferPLayer = function(id,indexRecord){
            var r = confirm('¿Está seguro de completar la transferencia?');
            if (r === true){
                $scope.editStatusTransfer(id, indexRecord);
            }
        };

        $scope.changeOriginClub = function(){
            $scope.newTransfer.player = null;
        };
    }
]);