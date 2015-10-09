advcApp.controller('listTransfersCtrl', ['$scope', '$routeParams',
    '$location','SessionService','listTransfersSrv','listPlayersSrv',
    'listClubsSrv', 'reportSrv',
    function($scope, $routeParams, $location, SessionService, listTransfersSrv,
             listPlayersSrv, listClubsSrv, reportSrv) {
        $scope.Transfers = {};
        $scope.newTransfer = {};
        $scope.Players = [];
        $scope.Clubs = [];
        $scope.format = 'dd/MM/yyyy';
        $scope.formName = '';

        $scope.divisions = [
            {
                name: 'Primera Honor',
                category: 'Mayores'
            },
            {
                name: 'Primera Ascenso',
                category: 'Mayores'
            },
            {
                name: 'Segunda Ascenso',
                category: 'Mayores'
            },
            {
                name: 'Tercera Ascenso',
                category: 'Mayores'
            },
            {
                name: 'Maxi Voleibol',
                category: 'Mayores'
            },
            {
                name: 'Pre Mini',
                category: 'Menores'
            },
            {
                name: 'Mini',
                category: 'Menores'
            },
            {
                name: 'Infantil',
                category: 'Menores'
            },
            {
                name: 'Cadetes',
                category: 'Menores'
            },
            {
                name: 'Juvenil',
                category: 'Menores'
            },
            {
                name: 'Sub-23',
                category: 'Menores'
            }
        ];

        $scope.category = [
            'Mayores',
            'Menores'
        ];

        var allClubs = [];
        var userRole = SessionService.get('userRole');
        var userId = SessionService.get('userId');

        var currentDate = new Date();

        $scope.formCreateTransfer = function () {
            $scope.createMode = true;
            $scope.editMode = false;
            $scope.formName = 'Formulario de Transferencias';
            for(var index in allClubs){
                if(allClubs[index].delegate){
                    if(allClubs[index].delegate._id === userId){
                        $scope.newTransfer.newClub = allClubs[index];
                        break;
                    }
                }
            }
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
                allClubs = angular.copy(result.data);
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
                return requestDate.toLocaleDateString("es-bo");
            }
            return '';
        };

        $scope.createTransfer= function () {
            if ($scope.validateFields()){
                var newTransfer = {
                    player: $scope.newTransfer.player,
                    originClub: $scope.newTransfer.originClub,
                    newClub: $scope.newTransfer.newClub,
                    division: $scope.newTransfer.division.name,
                    delegate: $scope.newTransfer.newClub.delegate,
                    requestDate: currentDate,
                    year : currentDate.getFullYear()
                };
                if($scope.newTransfer.originClub._id !==
                    $scope.newTransfer.newClub){
                    listTransfersSrv.save({transfer: newTransfer},
                        function (data) {
                            $scope.Transfers.push(data);
                            $('#create-transfer').modal('hide'); //hide modal
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            //$scope.newTransfer = {};
                            $scope.newTransfer.player = {};
                            $scope.newTransfer.originClub = {};
                            $scope.newTransfer.division = {};
                            $scope.cat = '';
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
            $scope.cat = '';
        };

        $scope.validateFields = function () {
            var player = $scope.newTransfer.player;
            var originClub = $scope.newTransfer.originClub;
            var newClub = $scope.newTransfer.newClub;
            var division = $scope.newTransfer.division;
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
            }else if(!division){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Tiene que seleccionar una división para la ' +
                    'trasferencia');
                $.noty.stopConsumeAlert();
                return false;
            }
            return true;
        };

        $scope.formEditTransfer = function(transfer, indexRecord){
            var index = 0;
            var indexDivision = 0;
            var indexClub = 0;
            var indexNextClub = 0;

            for(indexClub; indexClub < $scope.Clubs.length; indexClub++){
                if($scope.Clubs[indexClub]._id === transfer.originClub._id)
                    break;
            }
            for(indexNextClub; indexClub < allClubs.length; indexNextClub++){
                if(allClubs[indexNextClub]._id === transfer.newClub._id)
                    break;
            }
            for(index; index < $scope.Players.length; index++){
                if($scope.Players[index]._id === transfer.player._id)
                    break;
            }
            if(transfer.division){
                for(indexDivision; indexDivision < $scope.divisions.length; indexDivision++){
                    if($scope.divisions[indexDivision].name === transfer.division)
                        break;
                }
            }

            $scope.createMode = false;
            $scope.editMode = true;
            $scope.formName = 'Formulario de Edición de Transferencias';
            $scope.newTransfer = {
                originClub: $scope.Clubs[indexClub],
                player: $scope.Players[index],
                newClub: allClubs[indexNextClub],
                division: transfer.division ?
                    $scope.divisions[indexDivision] : '',
                index: indexRecord,
                _id: transfer._id
            };
            $scope.cat = transfer.division ?
                $scope.divisions[indexDivision].category : ''
        };

        $scope.editStatusTransfer = function(id, indexRecord){
            var transfersId = id;
            var newDataTransfer = {
                status: 'Transferido'
            };
            listTransfersSrv.update({transfersId: transfersId},
                {transfer: newDataTransfer},
                function (data) {
                    var newDataPlayer = angular.copy(data.newDataPlayer);
                    delete data.newDataPlayer;
                    $scope.Transfers[indexRecord] = data;
                    for(var index = 0; index < $scope.Players.length; index++){
                        if(newDataPlayer._id === $scope.Players[index]._id){
                            $scope.Players[index] = newDataPlayer;
                            break;
                        }
                    }
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
            if ($scope.validateFields()) {
                var newDataTransfer = {
                    player: $scope.newTransfer.player,
                    originClub: $scope.newTransfer.originClub,
                    newClub: $scope.newTransfer.newClub,
                    division: $scope.newTransfer.division.name
                };
                if ($scope.newTransfer.originClub._id !==
                    $scope.newTransfer.newClub) {
                    listTransfersSrv.update({transfersId: transfersId},
                        {transfer: newDataTransfer},
                        function (data) {
                            $scope.Transfers[indexRecord] = data;
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

        $scope.tableToJson = function(reqDate){
            var requestDate = new Date(reqDate);
            var data = [];
            var headers = [];
            var cont = 0;
            var day = "" + requestDate.getDate();
            var month = "" + (requestDate.getMonth() + 1);
            var year = "" + requestDate.getFullYear();

            data.push({
                'Fechas de Registro': 'Fechas de Registro',
                Dia: 'Día',
                Mes: 'Mes',
                Gestion: 'Gestión'});
            data.push({
                'Fechas de Registro': 'Fecha de Expedición por el Club Receptor',
                Dia: day,
                Mes: month,
                Gestion: year
            });
            data.push({
                'Fechas de Registro': 'Fecha de Repuesta del Club de Origen',
                Dia: '',
                Mes: '',
                Gestion: ''
            });
            data.push({
                'Fechas de Registro': 'Fecha de Registro en la Asociacion',
                Dia: '',
                Mes:'', Gestion:''
            });

            for(var i = 0; i < $scope.Clubs.length; i++){
                var tableRow = $scope.Clubs[i];
                cont = cont + 1;
                var number = String(cont);
                var rowData = {};
                data.push(rowData);
            }
            return data;
        };

        $scope.generateReport = function(transfer, index){
            var table = $scope.tableToJson(transfer.requestDate);
            transfer.player.dateOfBirth = $scope.obtainFormatDate(
                transfer.player.dateOfBirth);
            var transferData = angular.copy(transfer);
            reportSrv.generateReportTransfers(table, transferData);
        }
    }
]);