advcApp.controller('listTeamsCtrl', ['$scope', '$rootScope', '$routeParams',
    '$location', '$filter', '$q', 'listTeamSrv', 'listChampionshipSrv',
    'listPlayersSrv', 'reportSrv',
    function($scope, $rootScope, $routeParams, $location, $filter, $q,
             listTeamSrv, listChampionshipSrv, listPlayersSrv, reportSrv) {
        var currentClubId = $routeParams.clubId;
        $scope.currentClubName = $routeParams.clubName;

        $scope.Teams = [];
        $scope.newTeam = {};
        $scope.isFirstTeamSelected = true;
        $scope.Championships = [];
        $scope.createMode = false;
        $scope.editMode = false;
        $scope.permitEdit = true;

        listPlayersSrv.get({ club: currentClubId },
            function(players){
                $scope.players = players.data;
            },
            function(error){
                console.log(error);
            }
        );

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

        $scope.divisions = [
            {
                name: 'Primera Honor',
                cagetory: 'Mayores'
            },
            {
                name: 'Primera Ascenso',
                cagetory: 'Mayores'
            },
            {
                name: 'Segunda Ascenso',
                cagetory: 'Mayores'
            },
            {
                name: 'Tercera Ascenso',
                cagetory: 'Mayores'
            },
            {
                name: 'Maxi Voleibol',
                cagetory: 'Mayores'
            },
            {
                name: 'Pre Mini',
                cagetory: 'Menores'
            },
            {
                name: 'Mini',
                cagetory: 'Menores'
            },
            {
                name: 'Infantil',
                cagetory: 'Menores'
            },
            {
                name: 'Cadetes',
                cagetory: 'Menores'
            },
            {
                name: 'Juvenil',
                cagetory: 'Menores'
            },
            {
                name: 'Sub-23',
                cagetory: 'Menores'
            }
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
                division: $scope.newTeam.division.name,
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
                        $scope.Teams.push(team);
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
                division: $scope.newTeam.division.name,
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
            $scope.permitEdit = true;
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
                division: team.division,
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
            if(!team.players) {
                team.players = [];
            }
            if(!team.color) {
                team.color = {code: 'color1'}
            }
            if(team.division){
                for(var index = 0; index < $scope.divisions.length; index++){
                    if($scope.divisions[index].name === team.division){
                        team.division = $scope.divisions[index];
                        break
                    }
                }
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
        };

        var _tableToJsonMajor = function(players){
            var data = [];
            var cont = 0;

            data.push({
                'Nro':'Nro',
                'Nombre Completo':'Apellidos y Nombres',
                'Fecha de Nacimiento':'Fecha de Nac.',
                'Club Origen':'Club Origen',
                'Registro':'Registro Asociación'
            });

            for(var i = 0; i < players.length; i++){
                var tableRow = players[i];
                var lastname = tableRow.lastname ? tableRow.lastname : '';
                var secondlastname = tableRow.secondlastname ?
                    tableRow.secondlastname : '';
                cont = cont + 1;
                var number = String(cont);
                var rowData = {};

                rowData['Nro'] = number;
                rowData['Nombre Completo'] = tableRow.name + ' ' + lastname
                    + ' ' + secondlastname;
                rowData['Fecha de Nacimiento'] = _obtainFormatDate(
                    tableRow.dateOfBirth);
                rowData['Club Origen'] = tableRow.transfer ?
                    tableRow.transfer.originClub.name : $scope.currentClubName;
                rowData['Registro'] = '' + tableRow.record;

                data.push(rowData);
            }
            return data;
        };

        $scope.generateReport = function(){
            var teamId = $scope.currentSelectedTeam.id;
            var category = $scope.currentSelectedTeam.category;
            var filteredPlayers = $scope.players.filter(
                function(player){
                    if(player.team.indexOf(teamId) !== -1){
                        return player;
                    }
                }
            );
            if(category === 'Menores'){
                _generateReportMinor($scope.currentSelectedTeam,
                    filteredPlayers)
            }else {
                _generateReportMajor($scope.currentSelectedTeam,
                    filteredPlayers)
            }
        };

        var _obtainFormatDate = function(date){
            if(date) {
                var requestDate = new Date(date);
                return requestDate.toLocaleDateString();
            }
            return '';
        };

        var _generateReportMajor = function(team, players){
            var table = _tableToJsonMajor(players);
            reportSrv.generateReportMajorCategory(table, team);
        };

        var _tableToJsonMinor = function(players){
            var data = [];
            var cont = 0;

                data.push({
                    Nro: 'Nro',
                    'Nombre Completo': 'Apellidos y Nombres',
                    'Fecha Nac.': 'Fecha Nac.',
                    'O.R.C': 'O.R.C',
                    'Libro Nro': 'Libro N.',
                    'Part.':'Part.',
                    'F. de Part.': 'F. de Part.',
                    'Club Origen':'Club Origen',
                    'Registro':'Reg. Aso.'
                });
            for(var i = 0; i < players.length; i++){
                var tableRow = players[i];
                var rowData = {};
                cont = cont + 1;
                var number = String(cont);
                var lastname = tableRow.lastname ? tableRow.lastname : '';
                var secondlastname = tableRow.secondlastname ?
                    tableRow.secondlastname : '';

                rowData['Nro'] = number;
                rowData['Nombre Completo'] = tableRow.name + ' ' + lastname +
                    ' ' + secondlastname;
                rowData['Fecha Nac.'] = _obtainFormatDate(tableRow.dateOfBirth);
                rowData['O.R.C'] = tableRow.officeBirthCert;
                rowData['Libro Nro'] = tableRow.bookBirthCert;
                rowData['Part.'] = tableRow.departureBirthCert;
                rowData['F. de Part.'] = "";
                rowData['Club Origen'] = tableRow.transfer ?
                    tableRow.transfer.originClub.name : $scope.currentClubName;
                rowData['Registro'] = '' + tableRow.record;

                data.push(rowData);
            }
            return data;
        };

        var _generateReportMinor = function(team, players){
            var table = _tableToJsonMinor(players);
            reportSrv.generateReportMinorCategory(table, team);
        }
    }
]);
