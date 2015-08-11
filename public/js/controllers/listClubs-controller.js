advcApp.controller('listClubsCtrl', ['$scope', '$routeParams',
    '$location', 'listClubsSrv','listUsersSrv', 'SessionService','configSrv',
    function($scope, $routeParams, $location, listClubsSrv, listUsersSrv,
             SessionService, configSrv) {
        $scope.Clubs = {};
        $scope.newClub = {};
        $scope.formName = '';
        $scope.createMode = false;
        $scope.editMode = false;
        $scope.Users = {};
        $scope.editClub = {};
        $scope.showModal = false;
        $scope.Division = {};
        $scope.today = new Date();
        $scope.format = 'dd/MM/yyyy';
        var imageConfig = null;
        var userRole = SessionService.get('userRole');
        var userId = SessionService.get('userId');
        var filterclub = {};

        var restartValidationFields = function(){
            $scope.isNameValid = true;
        };

        restartValidationFields();

        listUsersSrv.get({role: 'Delegado'},
            function(result){
                for(var index in result.data){
                    var user = result.data[index];
                    var fullName = user.name + ' ' + user.lastname;
                    result.data[index].fullName = fullName;
                }
                $scope.Users = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        if(userRole === 'Delegado') {
            filterclub = {delegate: userId}
        }
        listClubsSrv.get(filterclub,
            function(result){
               $scope.Clubs = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        $scope.validateFields = function () {
            var name = $scope.newClub.name;
            var foundation = $scope.newClub.foundation;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            if (!name || !name.trim()) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese un nombre para el club que desea crear.');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            }
            if(foundation){
                var now = new Date();
                var dateFound = new Date(foundation);
                if(dateFound > now){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('Ingrese una fecha de creación valida.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            }
            return true;
        };

        $scope.createClub= function () {
            var newClub = {
                name: $scope.newClub.name,
                foundation: $scope.newClub.foundation,
                delegate: $scope.newClub.delegate ?
                    $scope.newClub.delegate. _id : null
            };
            if($scope.validateFields()){
                listClubsSrv.save({club: newClub},
                    function (data) {
                        var delegateId = data.delegate;
                        var index = 0;
                        for(index; index < $scope.Users.length; index++){
                            if($scope.Users[index]._id === delegateId){
                                data.delegate = $scope.Users[index];
                                break;
                            }
                        }
                        $scope.Clubs.push(data);
                        restartValidationFields();
                        $('#create-club').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        $scope.newClub = {};
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
        };

        $scope.formCreateClub = function () {
            $scope.createMode = true;
            $scope.editMode = false;
            $scope.formName = 'Formulario de creación de clubs';
        };

        $scope.formEditClub = function (club) {
            $scope.createMode = false;
            $scope.editMode = true;
            $scope.formName = 'Formulario de edición de clubs';
            $scope.newClub.name = club.name;
            $scope.newClub.foundation = new Date(club.foundation);
            var index = 0;
            if(club.delegate){
                for(index; index < $scope.Users.length; index++){
                    if($scope.Users[index]._id === club.delegate._id){
                        $scope.newClub.delegate = $scope.Users[index] ;
                        break;
                    }
                }
            }
            $scope.newClub._id = club._id;
        };

        $scope.findUserSelected = function(delegateId){
            var response = -1;
            for(var index = 0; index < $scope.Users.length; index ++){
                if($scope.Users[index]._id === delegateId){
                    response = index;
                }
            }
            return response;
        };

        $scope.editClub= function () {
            var self = this;
            var newClub = {
                name: $scope.newClub.name,
                foundation: $scope.newClub.foundation,
                delegate: $scope.newClub.delegate ?
                    $scope.newClub.delegate. _id : null
            };
            if($scope.validateFields()) {
                listClubsSrv.update({clubId: $scope.newClub._id},
                    {newDataClub: newClub},
                    function (data) {
                        $scope.showModal = !$scope.showModal;
                        $scope.newClub = {};
                        var index = 0;
                        for (index; index < $scope.Clubs.length; index++) {
                            if ($scope.Clubs[index]._id === data._id) {
                                var option = self
                                    .findUserSelected(data.delegate);
                                if (option != -1)
                                    data.delegate = $scope.Users[option];
                                $scope.Clubs[index] = data;
                            }
                        }
                        restartValidationFields();
                        $('#create-club').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            }
        };

        $scope.formDeleteClub = function (club, index) {
            var r = confirm("Esta seguro de eliminar el club" +' '+ club.name);
            if (r == true) {
                listClubsSrv.delete({clubId: club._id},
                    function (data) {
                        $scope.Clubs.splice(index, 1);
                    }
                );
            }
        };

        $scope.closeModal=function(){
            $scope.showModal = !$scope.showModal;
            $scope.newClub = {};
            restartValidationFields();
        };

        $scope.obtainFormatDate = function(date){
            if(date) {
                var foundDate = new Date(date);
                return foundDate.toLocaleDateString();
            }
            return '';
        };

        $scope.formTeams = function(club){
            //var path = '/listClubs/' + club.name +'/'+ club._id + '/listTeams';
            var path = '/listClubs/'+ club.name +'/'+ club._id + '/clubInfo';
            $location.path(path);
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' &&
            ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.tableToJason = function(){
            var data = [];
            var headers = [];
            var cont = 0;

            data.push({Nro:'Nro','Nombre Club':'Nombre Club', 'Fundacion':'Fundación', 'Delegado':'Delegado'});
            for(var i = 0; i < $scope.Clubs.length; i++){
                var tableRow = $scope.Clubs[i];
                cont = cont + 1;
                var number = String(cont);
                var rowData = {};

                rowData['Nro'] = number;
                rowData['Nombre Club'] = tableRow.name;
                rowData['Fundacion'] = $scope.obtainFormatDate(tableRow.foundation);
                rowData['Delegado'] = tableRow.delegate.name + " " + tableRow.delegate.lastname;

                data.push(rowData);
            }
            return data;
        };

        configSrv.getData(function(data){
            imageConfig = data.Icon.Image;
        });

        $scope.generateReport = function(){
            var table = $scope.tableToJason();
            var imgData = imageConfig;
            var doc = new jsPDF({},'pt','legal',true);
            doc.addImage(imgData, 'JPEG', 70, 0, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(195, 53, 'Asociación Departamental');
            doc.text(195, 78, 'de Voleibol Cochabamba');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(255, 125, 'LISTA DE CLUBS');

            doc.setFontType("bold");
            doc.setFontSize(14); //aumenta tamanio de la letra
            doc.cellInitialize();
            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre Club"){
                        doc.cell(70,160,150,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Delegado"){
                        doc.cell(70,160,210,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Fundacion"){
                        doc.cell(70,160,80,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(70,160,35,29,cell,i);
                        doc.setFillColor(221,221,221);
                    }

                });

            });
            //doc.save('Lista Clubs.pdf');
            doc.output("dataurlnewwindow");
        }

        $scope.tableToJason2 = function(){
            var data = [];
            var headers = [];
            var cont = 0;
            var day = '09';
            var month = '10';
            var year = '2015';

            data.push({'Fechas de Registro':'Fechas de Registro', Dia:'Día', Mes:'Mes', Gestion:'Gestión'});
            data.push({'Fechas de Registro':'Fecha de Expedición por el Club Receptor', Dia:day, Mes:month, Gestion:year});
            data.push({'Fechas de Registro':'Fecha de Repuesta del Club de Origen', Dia:'', Mes:'', Gestion:''});
            data.push({'Fechas de Registro':'Fecha de Registro en la Asociacion', Dia:'', Mes:'', Gestion:''});
            for(var i = 0; i < $scope.Clubs.length; i++){
                var tableRow = $scope.Clubs[i];
                cont = cont + 1;
                var number = String(cont);
                var rowData = {};

                /*rowData['Fechas de Registro'] = '';
                rowData['Dia'] = '';
                rowData['Mes'] = '';
                rowData['Gestion'] = '';*/

                data.push(rowData);
            }
            return data;
        };

        $scope.generateReport2 = function(club, $index){
            //console.log(club);
            var table = $scope.tableToJason2(club, $index);
            var imgData = imageConfig;
            var club = club.name;
            var address = 'La direccion del club';
            var player = 'Bhavana Ruth Palomino Pardo';
            var place = 'Cochabamba';
            var dateBirth = '24-09-1990';
            var Obs = 'Aqui Observaciones';
            var today = new Date();
            var todayYear = today.getFullYear();

            var doc = new jsPDF({},'pt','legal',true);
            doc.addImage(imgData, 'JPEG', 35, 10, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(185, 53, 'Asociación Departamental');
            doc.text(185, 78, 'de Voleibol Cochabamba');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 110, 'Formulario:03');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(185, 140, 'Certificado De Transferencia');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(35, 175, '1.- Club de Origen:' +' '+ club);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(58, 200, 'Dirección:' +' '+ address);

            doc.setFont("helvetica");
            doc.setFontSize(11); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(58, 220, 'De conformidad con la reglamentación vigente de la Asociación Municipal de Voleibol');
            doc.text(58, 240, 'COCHABAMBA Certificamos que:');

            doc.setFont("helvetica");
            doc.setFontSize(12); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(220, 290,  player);
            doc.text(180, 310, 'Apellidos y Nombres completos del Jugador (a)');
            doc.text(240, 350,  place +', '+dateBirth);
            doc.text(230, 370, 'Lugar y Fecha de Nacimiento');

            doc.setFont("helvetica");
            doc.setFontSize(11); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(58, 420, 'Que hasta la fecha a formado parte del Club' +' '+ club + ' ha cumplido con sus obligaciones y NO');
            doc.text(58, 440, 'tiene cargos pendientes con su Club, por cuyo efecto puede ser registrado en el Club'+' '+'CHACO');
            doc.text(58, 460, 'en la división de'+' '+'Menores' + ' de la gestión '+todayYear);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(35, 500, '2.- Firmas y Sellos:');

            doc.setFont("helvetica");
            doc.setFontSize(12); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(65, 565, '................................................');
            doc.text(70, 580, 'Presidente Club de Origen');
            doc.text(350, 565, '..................................................');
            doc.text(355, 580, 'Presidente Club Recepción');
            doc.text(230, 625, '.......................................');
            doc.text(255, 640, 'Jugador (a)');

            doc.setFontSize(12); //aumenta tamanio de la letra
            doc.rect(75, 800, 460, 85);
            doc.text(95, 815, 'OBSERVACIONES V B Y APROBACION COMISIÓN');
            doc.text(95, 835, 'DE ORGANIZACIÓN DEPORTIVA:');
            doc.text(95, 855, Obs);
            doc.cellInitialize();

            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Fechas de Registro"){
                        doc.cell(75,680,280,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Dia"){
                        doc.cell(75,680,60,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Mes"){
                        doc.cell(75,680,60,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Gestion"){
                        doc.cell(75,680,60,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(75,680,22,20,cell,i);
                        doc.setFillColor(221,221,221);
                    }
                });

            });
            //doc.save('Reporte Equipos Menores.pdf');
            doc.output("dataurlnewwindow");
        }
    }
]);
