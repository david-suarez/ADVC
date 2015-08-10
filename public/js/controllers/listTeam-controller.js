advcApp.controller('listTeamsCtrl', ['$scope', '$rootScope', '$routeParams',
    '$location', 'listTeamSrv', 'listChampionshipSrv', 'listPlayersSrv',
    'configSrv',
    function($scope, $rootScope, $routeParams, $location, listTeamSrv,
             listChampionshipSrv, listPlayersSrv, configSrv) {
        var currentClubId = $routeParams.clubId;
        $scope.currentClubName = $routeParams.clubName;

        $scope.Teams = [];
        $scope.newTeam = {};
        $scope.isFirstTeamSelected = true;
        $scope.Championships = [];
        $scope.createMode = false;
        $scope.editMode = false;
        $scope.permitEdit = true;
        var imageConfig = null;

        listPlayersSrv.get({ club: currentClubId },
            function(players){
                $scope.players = players.data;
            },
            function(error){
                console.log(error);
            }
        );

        $scope.colors = [
            {
                "name": 'Color',
                "color0": "#444"
            },
            {
                "name": 'Color',
                "color1"  : "#3366CC"
            },
            {
                "name": 'Color',
                "color2"  : "#FF6600"
            },
            {
                "name": 'Color',
                "color3"  : "#996633"
            },
            {
                "name": 'Color',
                "color4"  : "#009999"
            },
            {
                "name": 'Color',
                "color5"  : "#AA33AA"
            },
            {
                "name": 'Color',
                "color6"  : "#9933FF"
            },
            {
                "name": 'Color',
                "color7"  : "#999900"
            },
            {
                "name": 'Color',
                "color8"  : "#FF3399"
            },
            {
                "name": 'Color',
                "color9"  : "#3399CC"
            },
            {
                "name": 'Color',
                "color10": "#888"
            }
        ];

        listChampionshipSrv.get({},
            function(result){
                $scope.Championships = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        $scope.branchValues = [
            'Femenino',
            'Masculino'
        ];

        $scope.categoryValues = [
            'Mayores',
            'Menores'
        ];

         $scope.majorCategoryValues = [
            "Primera Honor",
            "Primera Ascenso",
            "Segunda Ascenso",
            "Tercera Ascenso",
            "Maxi Voleibol"
        ];

         $scope.minorCategoryValues = [
            'Pre Mini',
            'Mini',
            'Infantil',
            'Cadetes',
            'Juvenil',
            'Sub-23'
        ];

        var restartValidationFields = function(){
            $scope.isNameValid = true;
        };

        restartValidationFields();

        $scope.createTeam = function () {
            var newTeam = {
                name: $scope.newTeam.name,
                championship: $scope.newTeam.championship,
                division: $scope.newTeam.category === 'Mayores' ?
                    $scope.newTeam.major : $scope.newTeam.minor,
                branch: $scope.newTeam.branch,
                category: $scope.newTeam.category,
                club: currentClubId
            };
            if($scope.validateFields(newTeam)){
                listTeamSrv.save({team: newTeam},
                    function (teams) {
                        var team = teams.data;
                        for(var index in $scope.Championships){
                            if(team.championship ===
                                $scope.Championships[index]._id){
                                team.nameChampionship =
                                    $scope.Championships[index].name;
                                team.idChampionship =
                                    $scope.Championships[index]._id;

                                break;
                            }
                        }
                        $scope.setLocalAttributesClearance(team);
                        $scope.Teams.unshift(team);
                        $('#create-team').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        $scope.newTeam = {};
                    },
                    function(error){
                        if(error.status === 409) {
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'error', dismissQueue: true ,
                                timeout:2000 });
                            alert('Existe un error de duplicación.');
                            $.noty.stopConsumeAlert();
                        } else {
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'warning', dismissQueue: true ,
                                timeout:2000 });
                            alert('Hubo un error interno, por favor intente ' +
                                'mas tarde');
                            $.noty.stopConsumeAlert();
                        }
                    }
                );
            }
        };

        $scope.editTeam = function(){
            var teamId = $scope.newTeam.id;
            var teamIndex = $scope.newTeam.index;
            var newTeam = {
                name: $scope.newTeam.name,
                championship: $scope.newTeam.championship,
                division: $scope.newTeam.category === 'Mayores' ?
                    $scope.newTeam.major : $scope.newTeam.minor,
                branch: $scope.newTeam.branch,
                category: $scope.newTeam.category
            };
            if($scope.validateFields(newTeam)){
                listTeamSrv.update({teamId: teamId}, {newDataTeam: newTeam},
                    function (teams) {
                        var team = teams.data;
                        for(var index in $scope.Championships){
                            if(team.championship ===
                                $scope.Championships[index]._id){
                                team.nameChampionship =
                                    $scope.Championships[index].name;
                                team.idChampionship =
                                    $scope.Championships[index]._id;
                                break;
                            }
                        }
                        $scope.currentSelectedTeam = null;
                        $scope.setLocalAttributesClearance(team);
                        $scope.selectedTeam(team, teamIndex);
                        $scope.Teams[teamIndex] = team;
                        $('#create-team').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        $scope.newTeam = {};
                    },
                    function(error){
                        if(error.status === 409) {
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'error', dismissQueue: true ,
                                timeout:2000 });
                            alert('Existe un error de duplicación.');
                            $.noty.stopConsumeAlert();
                        } else {
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'warning', dismissQueue: true ,
                                timeout:2000 });
                            alert('Hubo un error interno, por favor intente ' +
                                'mas tarde');
                            $.noty.stopConsumeAlert();
                        }
                    }
                );
            }
        };

        $scope.validateFields = function (team) {
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            if (!nameRegEx.test(team.name)) {
                $scope.isNameValid = false;
                return false;
            }else if (!team.name || !team.name.trim()) {
                $scope.isNameValid = false;
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('El nombre para el equipo es inválido. Por favor ' +
                    'ingrese un nombre válido.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!team.championship) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese un campeonato para inscribir al equipo.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!team.branch) {
            $.noty.consumeAlert({layout: 'topCenter',
                type: 'warning', dismissQueue: true ,
                timeout:2000 });
            alert('Ingrese la rama en la cual participara el equipo.');
            $.noty.stopConsumeAlert();
            return false;
            } else if(!team.category) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese la categoria en la cual participara el equipo.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!team.division) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese la división en la cual participara el equipo.');
                $.noty.stopConsumeAlert();
                return false;
            }
            return true;
        };

        listTeamSrv.get({ club: currentClubId },
            function(result){
                $scope.Teams = result.data;
                for(var index = 0; index < $scope.Teams.length; index++){
                    $scope.setLocalAttributesClearance($scope.Teams[index]);
                }
            },
            function(error){
                console.log(error);
            }
        );

        $scope.formCreateTeam = function () {
            restartValidationFields();
            $scope.createMode = true;
            $scope.editMode = false;
        };

        $scope.closeModal=function(){
            $scope.newTeam = {};
            restartValidationFields();
        };

        $scope.formDeleteTeam = function(team, index){
            var r = confirm("¿Quiere confirmar la eliminación del equipo?");
            var teamId = team.id;
            var players = team.players;
            if (r === true) {
                if(players.length === 0){
                    listTeamSrv.delete({teamId: teamId}, function(data){
                            $scope.Teams.splice(index,1);
                            $scope.selectedFirstTeam();
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'success', dismissQueue: true ,
                                timeout:2000 });
                            alert('Equipo eliminado exitosamente.');
                            $.noty.stopConsumeAlert();
                        },
                        function(error){
                            console.log(error);
                        }
                    );
                }else {
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:4000 });
                    alert('El equipo aun tiene jugadores asignados. Por favor' +
                        ' elimine a los judagores de este equipo para poder' +
                        ' eliminarlo.');
                    $.noty.stopConsumeAlert();
                }

            }
        };

        var _isValidInscriptionDate = function(){
            var currentDate = new Date();
            currentDate.setHours(23);
            currentDate.setMinutes(59);
            currentDate.setSeconds(59);
            var finalInscriptionDate = new Date(
                $scope.currentSelectedTeam.finalInscriptionDate);
            $scope.createMode = false;
            $scope.editMode = true;
            if(currentDate > finalInscriptionDate){
                $scope.permitEdit = false;
                return false;

            } else {
                $scope.permitEdit = true;
                return true;
            }

        };

        $scope.formEditTeam = function(team, index){
            if(!_isValidInscriptionDate()){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:4000 });
                alert('No es posible editar el equipo, debido a que la fecha' +
                    ' de inscripcion para el campeonato al que esta inscrito ' +
                    'han terminado');
                $.noty.stopConsumeAlert();
            }
            $scope.newTeam = {
                name: team.name,
                major: team.category === 'Mayores' ? team.division : null,
                minor: team.category === 'Menores' ? team.division : null,
                branch: team.branch,
                category: team.category,
                championship: team.idChampionship,
                id: team.id,
                index: index
            };
        };

        $scope.setLocalAttributesClearance = function(team) {
            team.selected = false;
            team.isOver = false;
            if (!team.players) {
                team.players = [];
            }
            if (!team.color) {
                team.color = {code: 'color1'}
            }
        };

        $scope.currentSelectedTeam = null;
        $scope.selectedTeam = function(team, index) {
            if(!$scope.currentSelectedTeam){
                team.index = index;
                $scope.currentSelectedTeam = team;
                $scope.$broadcast('cleanSelectedPlayers',
                    $scope.currentSelectedTeam);
                team.selected = true;
                $scope.isFirstTeamSelected = false;
                $scope.$broadcast('updateTeam', $scope.currentSelectedTeam);
            } else {
                $scope.currentSelectedTeam.selected = false;
                $scope.$broadcast('cleanSelectedPlayers',
                    $scope.currentSelectedTeam);
                $scope.currentSelectedTeam = team;
                team.selected = true;
                $scope.isFirstTeamSelected = false;
                $scope.$broadcast('updateTeam', $scope.currentSelectedTeam);
            }
        };

        $scope.selectedFirstTeam = function(){
            if(!$scope.currentSelectedTeam){
                $scope.currentSelectedTeam = null;
                $scope.isFirstTeamSelected = true;
                $scope.$broadcast('updateTeam', $scope.currentSelectedTeam);
            } else{
                $scope.currentSelectedTeam.selected = false;
                $scope.$broadcast('cleanSelectedPlayers',
                    $scope.currentSelectedTeam);
                $scope.currentSelectedTeam = null;
                $scope.isFirstTeamSelected = true;
                $scope.$broadcast('updateTeam', $scope.currentSelectedTeam);
            }

        };

        var _isValidPlayerAssignation = function(team, player){
            var agePlayer = $scope.calculateAge(player.dateOfBirth);
            var response = true;
            var message = "";
            if(team.branch !== player.branch){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('No es posible asignar al jugador(a), por que la rama ' +
                    'en la que participan es diferente.');
                $.noty.stopConsumeAlert();
                return false;
            }
            if(team.category === 'Mayores' && player.majorCategory){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('El jugador ya pertenece a otro equipo de la categoria ' +
                    'mayor. La asignación que desea haces no es posible.');
                $.noty.stopConsumeAlert();
                return false;
            } else{
                switch (team.division){
                    case 'Pre Mini':
                        if(agePlayer > 10){
                            response = false;
                            message = "El Jugador no pertenece a la categoria " +
                                "'Pre Mini', puesto que cumple " + agePlayer +
                                " años este año."
                        }
                        break;
                    case 'Mini':
                        if(agePlayer > 12){
                            response = false;
                            message = "El Jugador no pertenece a la categoria " +
                                "'Mini', puesto que cumple " + agePlayer +
                                " años este año."
                        }
                        break;
                    case 'Infantil':
                        if(agePlayer > 14){
                            response = false;
                            message = "El Jugador no pertenece a la categoria " +
                                "'Infantil', puesto que cumple " + agePlayer +
                                " años este año."
                        }
                        break;
                    case 'Cadetes':
                        if(agePlayer > 16){
                            response = false;
                            message = "El Jugador no pertenece a la categoria " +
                                "'Cadetes', puesto que cumple " + agePlayer +
                                " años este año."
                        }
                        break;
                    case 'Juvenil':
                        if(agePlayer > 19){
                            response = false;
                            message = "El Jugador no pertenece a la categoria " +
                                "'Juvenil', puesto que cumple " + agePlayer +
                                " años este año."
                        }
                        break;
                    case 'Sub-23':
                        if(agePlayer > 23){
                            if(team.reinforcement > 2 && agePlayer < 20){
                                response = false;
                                message = "El Jugador no puede ser agregado " +
                                    "al equipo Sub-23 por que este ya cuenta " +
                                    "con dos refuerzos de divisiones menores."
                            } else {
                                message = "El Jugador no pertenece a la " +
                                    "categoria 'Sub-23', puesto que cumple "
                                    + agePlayer + " años este año."
                            }
                            if(!message)
                                team.reinforceBool = true
                        }
                        break;
                }
            }
            if(message){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:4000 });
                alert(message);
                $.noty.stopConsumeAlert();
            }else if(team.category === "Mayores" && agePlayer < 20){
                team.reinforceBool = true
            }
            return response;
        };

        $scope.calculateAge = function(dateOfBirth){
            var today = new Date();
            var todayYear = today.getYear();
            var maxMonth = 11;
            var maxDate = 31;


            var birthDate = new Date(dateOfBirth);

            var date = birthDate.getDate();
            var month = birthDate.getMonth();
            var year = birthDate.getYear();
            var age = (todayYear + 1900) - year;

            if ( maxMonth < (month - 1)){
                age--;
            }
            if (((month - 1) == maxMonth) && (maxDate < date)){
                age--;
            }
            if (age >= 1900){
                age -= 1900;
            }
            return age;
        };

        $scope.assignPlayerToTeam = function(player, team){
            var teamId = team.id;
            var playerId = player._id;
            if(!_isValidPlayerAssignation(team, player)){
                return;
            }
            if(team.players.indexOf(playerId) !== -1){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('El jugador ya es parte de este equipo.');
                $.noty.stopConsumeAlert();
                return;
            }
            team.players.push(playerId);
            player.team.push(teamId);
            var newDataTeam = {
                players: team.players,
                reinforceBool: player.reinforceBool ? true : false
            };
            var newDataPlayer = {
                team:  player.team,
                majorCategory: team.category === 'Mayores' ? true: false
            };
            listTeamSrv.update({teamId: teamId}, {newDataTeam: newDataTeam},
                function(dataResult){
                    listPlayersSrv.update({playerId: playerId},
                        {newDataPlayer: newDataPlayer},
                        function(resultPlayer){
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'success', dismissQueue: true ,
                                timeout:2000 });
                            alert("El Jugador '" + resultPlayer.name + " " +
                                resultPlayer.lastname + "' fue agreagado " +
                                "exitosamente al equipo '" + team.name +
                                "'." );
                            $.noty.stopConsumeAlert();
                        },
                        function(error){
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'error', dismissQueue: true ,
                                timeout:2000 });
                            alert('Hubo un problema en el servidor. Por favor ' +
                                'intente mas tarde');
                            $.noty.stopConsumeAlert();
                            team.players.pop();
                            player.team.pop();
                        }
                    );
                }, function(error){
                    team.players.pop();
                    player.team.pop();
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'error', dismissQueue: true ,
                        timeout:2000 });
                    alert('Hubo un problema en el servidor. Por favor intente' +
                        ' mas tarde');
                    $.noty.stopConsumeAlert();
                });
        };

        $scope.dragObject = function(event, ui, player) {
            $scope.draggingInProcess = true;
            $scope.currentDragPlayer = player;
        };

        $scope.dragFinishObject = function(event, ui) {
            return $scope.draggingInProcess = false;
        };

        $scope.dropCallback = function(event, ui, team) {
            var dragObject;
            if ($scope.currentDragPlayer != null) {
                dragObject = $scope.currentDragPlayer;
                $scope.assignPlayerToTeam(dragObject, team);
            }
            return team.isOver = false;
        };

        $scope.onOver = function(event, ui, team) {
            return team.isOver = true;
        };

        $scope.onOut = function(event, ui, team) {
            return team.isOver = false;
        };

        var _isReinforcement = function(dateOfBirhtPlayer){
            var agePlayer = $scope.calculateAge(dateOfBirhtPlayer);
            if($scope.currentSelectedTeam.category === 'Mayores' &&
                agePlayer < 20){
                return true;
            }else if($scope.currentSelectedTeam.division === 'Sub-23' &&
                agePlayer < 20){
                return true;
            }
            return false
        };

        $scope.removePlayerOfTeam = function(player, index){
            var teamId = $scope.currentSelectedTeam.id;
            var playerId = player._id;
            if(!_isValidInscriptionDate()){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:5000 });
                alert('No es posible remover al jugador, debido a que la ' +
                    'fecha de inscripciones para el campeonato al que esta ' +
                    'inscrito han terminado');
                $.noty.stopConsumeAlert();
                return;
            }
            var indexPlayer = $scope.currentSelectedTeam.players
                .indexOf(playerId);
            $scope.currentSelectedTeam.players.splice(indexPlayer, 1);
            var indexTeam = player.team.indexOf(teamId);
            player.team.splice(indexTeam, 1);
            var reinforce = _isReinforcement(player.dateOfBirth);
            var newDataTeam = {
                players: $scope.currentSelectedTeam.players,
                reinforcement: reinforce ? player.reinforcement - 1
                    : player.reinforcement
            };
            var newDataPlayer = {
                team:  player.team,
                majorCategory:
                    $scope.currentSelectedTeam.category === 'Mayores' ? false :
                        player.majorCategory
            };
            listTeamSrv.update({teamId: teamId}, {newDataTeam: newDataTeam},
                function(dataResult){
                    listPlayersSrv.update({playerId: playerId},
                        {newDataPlayer: newDataPlayer},
                        function(resultPlayer){
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'success', dismissQueue: true ,
                                timeout:2000 });
                            alert("El Jugador '" + resultPlayer.name + " " +
                                resultPlayer.lastname + "' fue removido " +
                                "exitosamente del equipo '" +
                                $scope.currentSelectedTeam.name + "'." );
                            $.noty.stopConsumeAlert();
                        },
                        function(error){
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'error', dismissQueue: true ,
                                timeout:2000 });
                            alert('Hubo un problema en el servidor. Por favor ' +
                                'intente mas tarde');
                            $.noty.stopConsumeAlert();
                            $scope.currentSelectedTeam.players.push(player._id);
                            $scope.assignPlayerToTeam(player,
                                $scope.currentSelectedTeam);
                            player.team.push($scope.currentSelectedTeam.id);
                        }
                    );
                },
                function(error){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'error', dismissQueue: true ,
                        timeout:2000 });
                    alert('Hubo un problema en el servidor. Por favor intente' +
                        ' mas tarde');
                    $.noty.stopConsumeAlert();
                    $scope.currentSelectedTeam.players.push(player);
                })
        }

        $scope.tableToJason = function(team, $index){
            var data = [];
            var headers = [];
            var cont = 0;

            data.push({Nro:'Nro', 'Nombre Completo':'Apellidos y Nombres', 'Fecha de Nacimiento':'Fecha de Nacimiento',
                'Club Origen':'Club Origen', 'Registro':'Registro Asociación'});
            for(var i = 0; i < $scope.Teams.length; i++){
                var tableRow = $scope.Teams[i];
                cont = cont + 1;
                var number = String(cont);
                var rowData = {};

                rowData['Nro'] = number;
                rowData['Nombre Completo'] = tableRow.name;
                rowData['Fecha de Nacimiento'] = tableRow.nameChampionship;
                rowData['Club Origen'] = tableRow.branch;
                rowData['Registro'] = tableRow.branch;

                data.push(rowData);
            }
            return data;
        };
        configSrv.getData(function(data){
            imageConfig = data.Icon.Image;
        });

        $scope.generateReport = function(team, $index){
            var table = $scope.tableToJason(team, $index);
            var imgData = imageConfig;
            var club = team.club;
            var teams = team.name;
            var category = team.category;
            var division = team.division;
            var branch = team.branch;
            var nameChampionship = team.nameChampionship;
            var today = new Date();
            var todayYear = today.getFullYear();

            var doc = new jsPDF({},'pt','letter',true);
            doc.addImage(imgData, 'JPEG', 70, 10, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(195, 53, 'Asociación Departamental');
            doc.text(195, 78, 'de Voleibol Cochabamba');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(260, 110, 'Formulario:02');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 130, 'Nombre Club:' +" "+ club);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 160, 'Categoría:' +" "+ category);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(350, 160, 'División:' +" "+ division);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 190, 'Rama:' +" "+ branch);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(240, 190, 'Campeonato:' +" "+ nameChampionship);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(450, 190, 'Gestión:' +" "+ todayYear);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(280, 225, 'RELACIÓN');
            doc.text(230, 255, 'NOMINAL DE JUGADORES');

            //doc.setFontType("bold");
            doc.setFontSize(10); //aumenta tamanio de la letra
            doc.cellInitialize();
            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre Completo"){
                        doc.cell(70,285,160,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Fecha de Nacimiento"){
                        doc.cell(70,285,110,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Club Origen"){
                        doc.cell(70,285,80,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Registro"){
                        doc.cell(70,285,110,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(70,285,27,29,cell,i);
                        doc.setFillColor(221,221,221);
                    }

                });

            });
            //doc.save('Reporte Equipos Mayores.pdf');
            doc.output("dataurlnewwindow");
        }

        $scope.tableToJason2 = function(team, $index){
            var data = [];
            var headers = [];
            var cont = 0;

                data.push({Nro:'Nro', 'Nombre Completo':'Apellidos y Nombres', 'Fecha Nac.':'Fecha Nac.','O.R.C':'O.R.C','Libro Nro':'Libro N.','Part.':'Part.',
                'F. de Part.':'F. de Part.', 'Club Origen':'Club Origen', 'Registro':'Reg. Aso.'});
            for(var i = 0; i < $scope.Teams.length; i++){
                var tableRow = $scope.Teams[i];
                var rowData = {};
                cont = cont + 1;
                var number = String(cont);

                rowData['Nro'] = number;
                rowData['Nombre Completo'] = 'Julieta Fernanda Salvatierra Castillo';
                rowData['Fecha Nac.'] = '03-03-2015';
                rowData['O.R.C'] = '1000';
                rowData['Libro Nro'] = '1444';
                rowData['Part.'] = '1234';
                rowData['F. de Part.'] = '03/03/2015';
                rowData['Club Origen'] = 'Atlantic Sigma';
                rowData['Registro'] = '14000';

                data.push(rowData);
            };
            return data;
        };
        $scope.generateReport2 = function(team, $index){
            var table = $scope.tableToJason2(team, $index);
            var imgData = imageConfig;
            var club = team.club;
            var teams = team.name;
            var category = team.category;
            var division = team.division;
            var branch = team.branch;
            var nameChampionship = team.nameChampionship;
            var today = new Date();
            var todayYear = today.getFullYear();

            var doc = new jsPDF({},'pt','letter',true);
            doc.addImage(imgData, 'JPEG', 35, 10, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(195, 53, 'Asociación Departamental');
            doc.text(195, 78, 'de Voleibol Cochabamba');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 110, 'Formulario:02');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(35, 155, 'Nombre Club:' +" "+ club);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(35, 190, 'Categoría:' +" "+ category);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 190, 'División:' +" "+ division);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(450, 190, 'Rama:' +" "+ branch);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 155, 'Campeonato:' +" "+ nameChampionship);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(450, 155, 'Gestión:' +" "+ todayYear);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(285, 225, 'RELACIÓN');
            doc.text(225, 255, 'NOMINAL DE JUGADORES');


            doc.setFontSize(10); //aumenta tamanio de la letra
            doc.rect(237, 270, 222, 15);
            doc.text(285, 280, 'Certificado de Nacimiento');
            doc.cellInitialize();

            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre Completo"){
                        doc.cell(35,285,180,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Fecha Nac."){
                        doc.cell(35,285,60,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Club Origen"){
                        doc.cell(35,285,80,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Registro"){
                        doc.cell(35,285,50,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Certificado de Nacimiento"){
                        doc.cell(35,285,200,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="O.R.C"){
                        doc.cell(35,285,35,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Libro Nro"){
                        doc.cell(35,285,42,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="Part."){
                        doc.cell(35,285,30,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else if(j=="F. de Part."){
                        doc.cell(35,285,55,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    }else{
                        doc.cell(35,285,22,20,cell,i);
                        doc.setFillColor(221,221,221);
                    }
                });

            });
            //doc.save('Reporte Equipos Menores.pdf');
            doc.output("dataurlnewwindow");
        }
    }
]);
