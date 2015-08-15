advcApp.controller('listTeamsCtrl', ['$scope', '$rootScope', '$routeParams',
    '$location', 'listTeamSrv', 'listChampionshipSrv', 'listPlayersSrv',
    function($scope, $rootScope, $routeParams, $location, listTeamSrv,
             listChampionshipSrv, listPlayersSrv) {
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

            data.push({Nro:'Nro', 'Nombre Completo':'Apellidos y Nombres', 'Fecha de Nacimiento':'Fecha de Nacimiento',
                'Club Origen':'Club Origen', 'Registro':'Registro Asociacion'});
            for(var i = 0; i < $scope.Teams.length; i++){
                var tableRow = $scope.Teams[i];
                var rowData = {};
                rowData['Nro'] = '1';
                rowData['Nombre Completo'] = tableRow.name;
                rowData['Fecha de Nacimiento'] = tableRow.nameChampionship;
                rowData['Club Origen'] = tableRow.branch;
                rowData['Registro'] = tableRow.branch;

                data.push(rowData);
            }
            //console.log("-----------------------");
            //console.log(data);
            return data;
        };

        $scope.generateReport = function(team, $index){
            var table = $scope.tableToJason(team, $index);
            var imgData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4QBcRXhpZgAATU0AKgAAAAgABAMCAAIAAAAWAAAAPlEQAAEAAAABAQAAAFERAAQAAAABAAAOxFESAAQAAAABAAAOxAAAAABQaG90b3Nob3AgSUNDIHByb2ZpbGUA/+ICHElDQ19QUk9GSUxFAAEBAAACDGxjbXMCEAAAbW50clJHQiBYWVogB9wAAQAZAAMAKQA5YWNzcEFQUEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPbWAAEAAAAA0y1sY21zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKZGVzYwAAAPwAAABeY3BydAAAAVwAAAALd3RwdAAAAWgAAAAUYmtwdAAAAXwAAAAUclhZWgAAAZAAAAAUZ1hZWgAAAaQAAAAUYlhZWgAAAbgAAAAUclRSQwAAAcwAAABAZ1RSQwAAAcwAAABAYlRSQwAAAcwAAABAZGVzYwAAAAAAAAADYzIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdGV4dAAAAABGQgAAWFlaIAAAAAAAAPbWAAEAAAAA0y1YWVogAAAAAAAAAxYAAAMzAAACpFhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2N1cnYAAAAAAAAAGgAAAMsByQNjBZIIawv2ED8VURs0IfEpkDIYO5JGBVF3Xe1rcHoFibGafKxpv33Tw+kw////2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAGZAfUDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKjurqKxtpJppEihiUu7u21UUckknoBUlfLn/BUf9tjTP2Rv2ftb1G4dWeG3JcKxDbzgrHx3Ydefu9vmBrWhRlVmoR6mNesqUHNni/8AwU1/4Lff8MltL4R+H/h+w8TfEC6kZYZZ7gvp+nQhsfaJgoBIIzgBh1HJ6Hy7/gj7/wAFv/H/AO0t+0bqXw0+L0WkXd7qCo+h3ul2K2mSWAKyLvwVweo5GOhzx8W+ONHv/g/+znqPxB8bf6Z8Tfi3N500sv8AywtP+WMMNeW/8Er/ABR/Y/8AwUR8G/8AXGav0F8PYWGWVKjg/aI8uriq1Kn7aof1AdaKxPhxqo1vwFpFz5rTNJaoHdsks4GGznkncDz3rbr85asexCSlFSXUKKKKCgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAr6tqkOiaXcXlw2yC1jaWRsE7VUZJwOelfjn+0nqk//BRH/gqJ4b+F6hpfDPgu5PiDW1Zt5STsufQDAH0r9JP28/jLB8H/AIL315NM0KQQSX0p2ggxxAEjPUfMynj0P4/nj/wQw8Ly3Hg74u/HzW/+Qh4ommmr6HKKXLRnXfoePiV9YxCgv+Xer+Z8f/8ABYj4wf8ACYftNTaXF/yDvD8Pkw18tfsjeOP+EH/bL+GWsyf9ByGGb/rjN+5rb/ao8YS+OPjF4h1SSXzvOu5q8XuNYl0eeK/tv9dpd3DeQ/8AbGav1CtS9nl3sgr0vaUvZH9e/wCzlqkep/CbTwjbnt2kjkGD8rby2PyYH8a7mvmf/gmD8aIvi1+z3od5lQ+qabDqMYwdzAgI3PTAwn5nr2+mK/FMRG1Ro7cDVVShGS/qwUUUVidYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUjtsQsegGaAPyv/wCDiT46ta/BG/8ADemSqbvxHewaGmAQeCS2c9wzMPwH1rvPB3giL9lD/gjGYf8AUzTaRXyx/wAFEbiX9qf/AIKifDfwJEnlw2sz6xMuc7dzE4z3619lf8FlNWi+GH/BPtNJ9QF/L/8AXX1mDw/JGjh/+flRHi4CXNGrX7s/nz8Yah9ovppf+e01cbcW/wBo86KtbxBrFc9cahX6vXXslY6dT9yP+DZ79o1fEHwDs9AkXcdAv5tEbjJG4ggjn+8F/DNfrnX8z/8AwQD/AGg5PhR+2RqPhmJtkvii3EiNgHE8ByDg+9f0s6XqEWrabBcwOJIbiNZEYDG4EZBr8Zz/AA/ssR6meWztKpS7P8yeiiivCPVCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuZ+MniBvC/wx1m9TcJEgKKVbaULEKGB9Ruz+FdNXlH7YWtrpXwsSIy7GubpQUDYMihWJ47gHb+OK1oR5qiRx5hW9lhp1OyZ+YP7BWg/8L1/4LT+PvEEv+p8LwxadXqH/AAcwfEP/AIRL9nPR7EdXcsf5f0qv/wAECvh99p8e/F7xjL/y38RTCsP/AIOlNI+1fBTwyfc/zr6vA1v+FWkYYKl/slM/DK41GXUJ/Kiqa38P/Z4PNlr0L9n/AOA+s/GDxjp2g6Ta/wBpajqc3kwxf+1pv+mNfsd/wSc/4I5/D9XvvH3i+O18avEfsmkBj/oeB1IHft+dfSZzxbl+BxX1Sq/a1f4nszejQq1KXtT8UPgv44v/AIP/ABw8J+LdJi1SaXw9qMN5N5UM037n/ltX9AnwB/4KpaN4P0CO2nGqzWjLE6x3OnTZjB+8FPbPvkZ5x1z9s+Hfg34U8LW/laf4c8PWUfpDp0UX9K3f7Bsc/wDHpDXw+YZ7HGVPaSpHJUyqTre2oVbHzr4Z/wCCp3gTX5VDGKJCRuK3W4gdyBtGfzFemeEf2xPBXjPabW8m2Hq4VZAv12En9Kj+K3iDwD4A8O6hf+IbDQxZ2UEt5eSywxGGCKH/AJbS1/O3+3x/wUIv/wBqf9oyXWfh5FP8N/DPh7zodDi0v9zPqn/Taank2WPMqvsqMGjWp7elvNP5H9N+ja/ZeILQT2VzFcRnujcqcA4I6g4I4PIq5X81X7Pf/BXT43/A64WabVF8Uw22dr3bFWXIwcEe1foT+x//AMHB/hbx1cwab4u8/wAK387ZZNWYmPtnD9QcD3HPSunHcLYvDeYLHTh/Gg0fqZRXGfC/48+HPi1YpNpd7FmU4iR5EzMMZymCQw4PTkY57V2dfNzhKD5ZKzPQhOMleLuFFFFSUFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUVzPxS+Kem/Crw897fSK0rAiCDdhpm9PYDue31wC0r6EVKkYRc5uyRoeM/G2neAtEe/1KcRRLwqjl5W7Ko7k/8A1+gJr4K/aw/aW17452Gq3Hg+2hurDSStr9tlfdYx3coAjtITgefOTzmLnoM8Cu/sNP8AEX/BQTxfJqEl5daL8KoB9nkmQ/vdcX/lrDEescZwMseTj0AA5uz/ALC+JPxLEugwwWXw5+HEv9m+HrSGLyoJrz/ltNXzPHnF1LhbJamYf8vVt5HPhsBUzOrySVqP5nwz+z/44/aq/wCCU/jHxDoMXw5/4WdpPieb+0vt9hXEftTaL+1J/wAFVfGEMnifwPN4I8O6X0+3cV+qFvqF1bj91LPXlv7SHxAuv7KmtfNn8mGv5qyz6TvElZ06FGlT9q/+Xp9euH6VJHxx+zz+yTp/wF8UaV8OvBV3Nrvjb4gSxadqWtH/AJcbP/lt5Vftd4A+H2l/C/wTpPh3SYhBp+i2kVnaRekUWAK+Bv8AgkF8MP8AhN/jh42+I1zF50OgQxaBpJ9OP31fom7AKcEksea/oPg/DVnhf7QxdT2tar/EqHjYiyqezp7F0A+1eYfHf4m3Ph6EWNlIIp5uM16Dq2ojTdLluPQV8rfHD40aX8L9K8TePPEkvk6H4StJdSm/7Y/6mH/v9X261OQ+Av8Agvh+1R/Y/hzSfgZoEvna3rUMOseM5f8Apj/z51+YFvo8WnVc+NH7RF/8cPip4m8b6vL52t+LdRlvJv8A2jDXEXHiGW5nr9v4cy+hgsImmcdesdj/AGvae1TfaItQg8qXyJof+eUtcFb6xLWjb6xX0P7lmPtz6G/Za/bu+JP7G+t28nhzUWv9CjYMuh3pwVI6EHsa/aj/AIJsf8FevB/7WWiQ6dPez22uMwEmn3jD7VZEnkOSeV5znqPcYx/PPb6x9orW8L+MdU8D+KrTXtEv5tH1vS5vOtL+1/18FfK53wzhcUv3P8Q5qkGqntKP8R9Oh/XDp2p2+sWaXFpPDc28n3ZInDq3bgjip6/Kv/gkj/wWaHxfgtvBvjBorLxPETmMYFte56tG3UEdcZwcnoTkfqToet2viPSoL6ymWe1uF3RuvQj/AB9u1fk+PwFXCVPZ1UejhsUqnuS0kt0W6KKK4TqCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCh4n8RW/hPQbrUbokQ2sZkYAjc+OijOBknge5FfGMmj6l+3r8a7u2F5dQeANFuCutu4/4/yCdtjCBwMD/Xe/1rov2yvixrnxL8e2Hw+8KYGq6jdNbWhGQVQYWe4POD5JBx7Ma9y8CeCtG/Z8+FEWn2McEOn6VFmaU/ufPl/5azS/lmulR5Icz3Z46axdZyl/DpvXzZ47+398dYPgZ8HoPBfhiGGHXfFhi0HSIov+WHnZFcj4H8D2vwv8HaToNl/qdLtPJ83/AJ7zf8tpq8X8cfEiL4oftpReI9Wlmm8PeBNOmm83/XWXnTV9G+GPh3428f6XFf6bpdlpGnzf6q5v7vzvPi/57eVFX8m+NeScQcRZpSy/L6VT2VPfsfbZPXo0qXtapRuPNt4JpfKmr5Z/aY8Yf2PBqN1L/wAsIZpq+nfH/gvwJ4Knk0z4hfHGHQdaIz9mi1GGx8j8K+D/ANr/AEDxloHxu0jwJb+NvCWreGfF0P8AaWh+Ij/y+xQzfvrOavE4X8Bs6wuLpVa3swx3EFKlS9rVP09/4JwfBn/hR/7Jfhmwl41DUof7SvD/ANNZua96IIHOK/M24/bQ+INxBFFL8UPDGgwwwwwwxWGnVUH7QGs+IDFFfftBa1/2y8mGv7Jw2SVaNFUbHw1LiDD1X+7TP0L+L15LbeEJmjhl3Hjivjv40aP/AMLI8Y+E/Ad7azzWmp3c2savFL/qJ7SH/UwzV5xcXGg+IIPK1L48eLv/AAY1Fb/Af4X/APCRy69H8X/Fs2ozQ+T5v9r14fE2SYytl9XCYSr7KrUPSwWPh7X2rpM6H40f8El/gP8AHgf6b8OYdNu/+eul/ua+M/jx/wAG29r/AK34ZfEHyf8AplrNfTXjDwd4X0eCb7F8afF3/gXXTfsn/tgReMNVu/AfjLWbKbxZosPnQ3/+ph8Q2lfz7mlPxB4Mwv8AaFPFe1pUz6fCVcLjavsnSsfjR+0R/wAEx/jd+yv5sviDwlNrGnf8/wDo376vBrfWIrj91/y1/wCeX/Lav6irfWItYg8q2lh1KL/nl53nV89ftQf8Et/gt+1RBNLq3hKDQdb/AOgppcPkz19HwZ9Ld39jxFS/7iUzHG8Mr/lyfgjb6v8AZ61rfWK+n/2yP+CJ/wAUP2X4LvXvC0v/AAsjwxD/AOBsFfIlvqH76aL9/DLD/ropf+WFf2bwX4hZJxNS9rlVX2lM+brUK2Fq+yqnZaP4guvD+q2mqabdTabq2mTedZ38X+vspq/dz/gi7/wVUX9pjwN/YviOWO213SQkOqW7nBspCDhgf7pPBB4Gc5HOfwBt9Qrvf2f/ANoDWf2Z/jVofjfSZZvO0yb/AEu1/wCgpaf8toa9riHJKWKo6Hn1KfK/bUv4h/XErB1BBBB6Glrwj9gH9qLTf2mvgfpOrWFzHLbT2sctiQAplt9oA4zyVIwTjoV6k17vX4pXoypVHTluj16NVVIKa6hRRRWJqFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV5d+0p8eLP4XeGLm0hlB1S5iKjaxH2dSPvZH8WOn5+gPJftrft7eEP2RfAlze6rq9pb3WDHGoYSSmQHHlon8UnoO3U9gfxv/AGqv26/Fv7S17PLrt/deD/C7YEWnKxbVdVwMDzpj7DFetluWVMRNaaHFWdavehhNZfkfd/w4/bM+G/wCvNd+IviPXG8Q+KtXb7BY6TZHz7iOPOSSe+T1riviJ/wWr8G2fwT8T/Er4oeE9Vm8PeGNdi0K08O6Ycn/AK7TV+W/jD9pG18H6VFa2PkaPaQ/uf8AptPXHeF/jj8UNH1bUb/wBYQf8TqHydRi16HzrLVIf+m0Ne1XyT9z7T/l4fR/6q1MFhPa1n7M+8f2i/8Aguj4/wDjz8OPFPg7wP8As+ND8M5IJdI8TXxz/wAS20vMCG7449Tz6fSvKPF/7Q/xx/Ymn8FeI/Bnxwl+Jvh/wD4eGh6jo4/1M9pj/j8i/T8q+QPC2kftDaNrviG/0nxjpnw+h8Tw/wBm6jFo3+onhrIg/YgsNZuPN8SeO/EGr14Ly2tf+EfI18/wuFX72qel6N4h+EHjzQdP/aJ8Y/F6zuPj1Hqcza74N8Wab9tsvEEUWB+uB+VP/aK/b+1D/goN8YvDN/4F+Gl7oHh/wXD5MOn6N/x5w1nfDf8AZJ+Ffhi4iJ0KG8P/AD1v6+n/AIT6hYeB9KisNEsLLTbSH/llaw+TXo4LK6vtva1T5Cv4mYTC1fa0aXtf+vh84W/hf4v+IIPNi8B+IZq27f8AZm+PGsf6r4fT/wDgXX3D4H8YXVx5Nem+H/EF1ceTX1fsKtjuoePWb1P4NGkfmtcfsn/tBf8ARL9TmqK3+D37QXgf/WfCXxdX67eF/EF1n/j6nr0fT/EF15EP+lT141fF1ae59hgfGHM6v8VUj8R/+F4fEbwP/wAh/wAB+LbP/rraTV7f+z/+3x4Xtp4YtWtfJm/6aw+TNBX6XfEDWPtGlTfaYobz/rrDXw9+1B4f0HWJ5vM0HRZpv+esUNfK51gVmmEq4SqenjOLauZUvZKlY9M8H/tA+HPGHlS2WqQQy/8ALHypq9T8LftAa94f/wCWsGpQ/wDPK6r8n/D+j6Xo/wAaZtB/tTU9Hi1O087TpbWb9zBND/roa9z8H/Fjxv8ACb97ff8AE+8Pf8/9r/7Whr+S+LPDfCUqtSikfPUXmuFpe2pVfan6i/D/AOOGjeOLj/oD6t/z63U1eDft0f8ABJf4fftkQTX9j5Hgnx5/0FLCvPfh/wDFiw+JGlWkttLDN5/+pr3/AODH7QH2eeHRvEkvnQ/6m0v5f+WH/TGavyKpgM74Txax+R1alP2fTufRZNxLhMy/c4z+Kfht+0x+y/43/Y/+I03hzxtpc+my/wDLG/8A+WGqQ/8ATGauIt9Qr+iz9pD9mfwb+1R8OZfCXjbS4NStP+WMv/LbS5v+e0M1fht+3R+w/wCI/wBhf4qf2DqXnXmian++0jVP+WE8Nf3j4GfSGo8VUVlOZP2WKHmeTeyftqP8M+wP+DfL9t2f4aeOb/4aXi7xG39saKmQPMQjDLnBxlSRnHGa/bqT9qjwpBoP26S5lTYMyxlQPK68liduOOxPUe9fyh/A/wCKEvwX+NPhjxbbS+TNpl3D/wB+Zv3M1faP7cH7ZHij44arL8NPBOqTw6J+5/te/i/5b1+uZ1w/7XF3ufEVMXXoYr2NFfxNfQ+0v2z/APg5B8NfDHV7nSfA0Z8UagnBFuNttFg5BL/eJ6A4IBx0r5ctP+Dnn4x2l3FKfCvh2URuH2STuUfBzg4I4NfG3ij9m+68D6V5tzF5Ne9f8EdP2HLH9pT4uyeNdetDfeGvCd5DBpungZOq3ldVbI8uwmE9qv3h2VqqhD2tVu5+4/8AwS2/a28eftt/sp2nj/4g+AF+Hmp6jqNzFY2STmVL6yQgRXQBJKbjuG0k/cz0Ir6MrN8G6J/wjfhTTrAiMPa26Rv5YwrMB8xHTqcn8a0q/MJtOTa2PdhflVwoooqSgooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuM+PXxLb4WfDbUNShRmvPJkW2xjCOEZtxz2GM4xzwO+a7OvkX/gsr8R9Q+F/7KOq6jYOwl+yTgLngt8mDj1AJ/M10YWl7SrGHcxxHP7N+z3Pwi+Ln7Ynif8AaX8eat4+8cXEMnif7Te26of9To8cU+TFFD9TXn1v/b3xYn82xl+x6dP/AK6/uv8AXz/9caybjyvFHir7LJL52n6X++u4v+f2aunuNZ4/d/6mH/llX6XldD/l0fXKtRySKwmEX73/AJeVC3o/gfw54Pn82KL+0rv/AJbXV/8Avq0LjxxLcVydxqEtzPR5/tX0vsKVOkfPY6VbFfvarNbUPEEtYdx4orP8Qax9ngrk7fUL/wAYeK7TRtJtZ9S1bVJvJs7W1h86aevjs6xFGivbVnY/Ns0wPtq1keseF/EH7+KvafhvrFfMtxo+vfC/xV/Y3ijRr3QdR/132W/h8mevYvhf4oiFePgcdRrUvbUatz834hyqtSPqv4f3FeveF7jFfOvgf4gWtvDXe2/xoit6+l9v+6Pj8Fh6vtj6U8PaxFb10/8Awsi10+xr5DuP2iK5/wAU/tQS/wDPWvm8bWP1TJcPVPo74wfHiK30qWvi748fGCLUJ5a5n4oftIS6h5372vnv4kfFjjzbmXya8KhdvQ/SMDRZU+KHjC6t/FWh6pZSw/a9Mu/+Wv8Ay3h/5417R8F/2kIrjVYrW5ln0fUJ/wDlldf6ievnDR/N8UaraX9z/odpD++hil/1081dDcW9rrH7qWLzq9bG+GVHOMJ7ar+6qnr0K9WkfZnh/WIvh/qv9vabF5Np/wAxGwi/5Yf9Noa9T0f9pjQdYnitfNgmlr4Y+F/7RN/8L/8ARfEEs2seHv8An6/5bWUP/taGvo7wN4P8G6fof9vWOlwXn22H/RLqKbzoK/mXjThGtlFR0c2pXX/LuoceNyeljav1uj+6P0T/AGV/jB/wnGk/2DfS+dLBD52nSy/8t4f+eNbn7UH7N+g/tYfBbVvBuvxQzQzQ/wCiXX/LbS7v/ljNXy14g8YS/B+fw9f20vkzWU0NfY3/AAmFrrGlWl1bf6m9h86v5U4jwlbJcypZvl/7r/n3/wBfD6vhTMvr+E9hW/iUj+dn9oH4H69+z/8AE3xD4I8SReTq2lzTQzf9N4f+WM1fbn/BMf4L2Pij4H6T4or0j/gtx+zNF8UPAFp8UNN/5GHwx+51H/pvDXBf8En/ABB9n/Yt8Txf9AzXJq/0n8NvED/W7hqjj/8Al8v3dU8HHYL2Vb2Z5l/wUI+JEVtPNYWVfr7/AMEcv2Yx8HPhN4etlOF0qySaXodzurKo6+5Of9n3r8O/iB5vxQ/ah8MaN/0E/EUMM1f0qfsZ6RFpvwzunRFEkt6wZsckBFwM+gyfzNfZ8U1nSw9OijwXSU8bTg/s6/ceu0UUV8CfSBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABXhP/BRH4L2fxy/Zv1jRL2JmhvYZLWVxn5I5EOc9sFlTk+3rXu1UvEejjxD4fvrBn2C9geAtjO3cpGcfjWtCq6dRTXQzqxcoNI/ku+KH7P/AIj/AGR/j94h8JeJJYJvPhhmtL//AJ/YaqXGsxV9Vf8ABf34d33w2/a18HatMuy01PS59JkXIO1gcEZHHWvhm41j7PX6rktel7IwwWMq4n95V/iHb/2xF6VDceIIrc1wdx4orP1DxhXpVsdRVI9esbfijxRFX3l/wbf/AAu0vxR8TfiF4yvYvO1HRYfJ06WvzL1jxB9oNfsD/wAG0Hg+W3/Zs8ea9/0E9Wr+X/pGZ17Dhaq6Tt7Q48mwV8X7U+q/+CiH7G9h+2R8AdRsIrWD/hMtL/4mWh39fjP4X1C68PzzWt7FPZ3emTTWd3FL/wAsZoa/oPr83f8AgqB/wTO17xR8RtR+I3wy/wBMl1T99rmjV/N30efFR5di6mU5vVvTqfwxcccMLHUfa0V+8Pkm3+KH2eCi4+NH/TWl+E//AAT3+PHx40qK/wDD/gi9h0//AJ/5a+qP2fP+Dbr4jfEuMz+NvG2m+HdOA6KMk1/d1XNKLSsflmD4YqrekfHesfHj/prXEeKP2kLXT/Nilupppv8An1i/19fYv7Vt1+zV+wVJf+Cfg7okXxY+JxGZvFetTCbTND9uK+Gbf4f2vny3VzF9su72bzppZf8AlvNXp5ZktbHv2tb93TPsKGV0qRz2sfFjWfFB/wBBih02H/nrL++nrJ0+3itrjzbmWfUrv/nrdV6FceB9L/59fJrnvEHw/utP/e2Mv2yH/nl/y3r6qjw/Sw372lTPTVyW31ita31j7RXEW9xWvb6hXvUK3tdA1OxFx9orrP2f/ihf/C/x/aWFt/pnh7WruGG7sJZv+m3+uhrze31CrlvqH2ee0li/1sM3nQ1wcU8PUc5y6rhKtITraWPvz9uj4wWujz6HoMUvnXc80NfW3wv8cS6f4H0m1uZf3sFpD51fkp4H/aIi1j9pPSfEfjWLztJ/cw/9gu7/AOWN5X6Baf8AECXT5/3ktf53+J/h/issdLAYqloenwpR9lTuex/EHULXxjod3o17++tNUh+xzRS18n/8E/8AwPL4G+BPxe0H/oF+LZq9O1j4ofaPKqH9kf7LrEHxIi/6CeuTTTf9dvJr7D6P9Gtl+Lq0P+XVQ9HOX7Slc+I/A9v/AGP+3d4Cll/6GKv6UP2R5/P+F8p/6fH/APQEr+cX9sj4f3/wv8fxa9Zf63TLv7ZD/wBsZq/eP/gmd8e9M+Kvw0sr22upJF8QW8VxbryU3KrbvoSMfXb9K/qvi6lz0KdZHx6Sp4ynN9U0fVFFFFfn57wUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAfAH/AAXA/wCCaMP7Yv7O+rnRiYPEkEi3+mzYJNtdJkhs/wB0+/QkY64H4WfBn/glB+0h8dviNeeDrHwTBo+t6X31Cb9xN5Nf1latpcGt6ZcWdzGJbe5jaKRD0ZSMEV+fv7Tekz/snfFWw8W7ttt4ZuoLmeQKQJbc/wCtYZ/zkEV7WBx1aMHTp7o8HFVa2CxUJUv4dR2fk/8Agn5E/wDENf8Atf8A/QB8Mf8AgxrQ0f8A4Nf/ANpsj/TZfCOm1+tnxA/b48OeKLiWXRPFui6lF/rofKvIa89uP2yIv+f+D/wLrGtmOMqdD3vbHxb4X/4Nr/DnwGn8M698VfG8PiqGfV4odRsLCv068P6P4c+B/g6LQdIsLLR9J0yHybSwtf8AUwV87eMP2gLD4keDtW0u51Sys/ttp+5llmh/cTf8sa8n+JH/AAUI8L2/gC0utS8UaZDqEMPk6jFFN50/nQ1/LHjvwfnGc4rDVaNSrVpf8+j2Mmr0aVKqfWvij9oiw0eCbypYK8W8cftQfaNV/wBGlr4N+JH/AAUYsLieaLRItT1ivF/FH7RHjz4gedF9vh0G0n/5ZWH+u/7/AFc/BX0bc1qtVqtL2RtWzqkfqJ8KP+Cl/gf9ljRPG+heP/Efk2Ali17QtMsP9fNLNXyd+3B/wWd+JX7ZGmzeGfCwm+GPw06fYbX/AI/r2H/prXx3b6Pa6dP5snnzTf8ALaWWbzpqS58QeRX9x8JeH9LLMHSpYur7WrTPla1f2lUmt7e10eDyoovJqpcaxLWfcah9orO1C4r9HsqSMrmh/bMvtVS48US1N44+G+vfDeDw9LqVr5MPie0/tLTrr/lje2lesfsP/sD+Mv24PH81h4f/AHOk6ZND/a+sy/6mCGvmuIuMMuyvL6uYYyr7KnT/AOXgUKFarV9lSLf/AAT/AP2B9e/b4+NMtrF5+m+GNF/fa5rP/omGuY/bA/Y38ZfsT/EabQfFFr/xLp5v+Jdf/wDLCeGv3l/Z3/Z38L/sr/CTTvBvg6w/s3SdM/7/AE83/Laaapf2gP2f/C/7THw5u/CXjGwg1LTr2H/wCm/57Q1/AND6WGKpcWVMTf8A2E+v/sCl7H2X/L0/nJt7j7PWhb3Fex/t4fsEeKP2F/H/ANlvv9M8Mz/8g7VK8Lt7iv7+4W4py/PsvpZjl9X2tOqfK1qFXC1vZVjRuD9pg8qT99DX01+xf+0BL4g8OTeCNXuvO1bRYfO06X/n9tP/AI9DXzBcXFJ4f8YXXgfxVp2vWX/H3ot39sh/6b/9Ma8jxH4So55lVWm/4tL+GOhX9lWPvjWPFEtufNkl8mGH99NXk/wX/aZ1n4L+Kppb6KeG08QSzXlpLL/qL2Gtv4geMIvGHwWh8R6J/qvE8MMNp/0xmm/c+TXp3xI+B/hf4kfBbQ/BurRTQzeHrSGG0v7X/X2U1fhPhBlbo4urWrUtv3Z4HH3GmEyd0qNb/l6cb+0R8cNB+LHhz/ptXrH/AAQk/bcj+F3xGHw41G98xY5/tmgJwPMQjDLkg4ypIzjjNfAXxY/Z/wDiD8F5vK1K1n1LSf8Aljf2H/PH/ptXJ6P8QZfC/iO01mxv5rPVtMu4by0uv9TPBNDX9EYjBUauE9izDDZjhMxpqvg63tGf2FeFPE1r4y8PWup2TM1tdpuTcMEc4IPuCCPwrQr4p/4Ic/8ABRix/wCCgH7Md2JLGbTvFXga4TTtbhcEhnkDOjg4xzhxjJxtz3Ffa1fkOJoulVlTfRn11JycE5bhRRRWBYUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAV4V+3p8DLf4w/CC/je0NwGtpLe72AZNuykknudpA+gZj7j3Wq+q6ZDrWmXFncJ5lvdRtFIuSNysMEZHPQ1pRqOnNTXQxr0VVpuD6n8j3jn4Ty/Bf4qeJvBF759nd+Ebuaz/wCePnw/8sZqz/sB/wCf/VP/AALr9CP+Dgv9iyb4fa3/AMLR0myEi6Qf7O19xj94hGVbgnGVIOM8Zr81rfWJa/bOHqtDFYTY8mlVc6fK90dD/Y8Vz/rZb2b/ALbVDbaPYW/73yoPOrE/tmi41ivY+rYen0OpVjpv7QtdPqpcaxXKf8JRHVO48YRW9NV6PQep09xrEtxWdcahXM3HiiW5/dW0VekfBf8AY/8Aih+0Rcf8U/4c1SbT/wDltfy/ubKD/rtNNWFbNaFHVjjGTdkjiNQ8URW/7qL99NXrv7C/7B/ij9vj4xaTo0eqQeFfDF7d+TNr1/8A+RobSunn+C3wl/ZIP/FbazB8X/GP/QueHP8AkFwTf9Nruvbv+CX/AIp179pD9tmLXtfistN07wXoc02h6NYf8eWlyzV+V8U+I9HCUKz7H1+C4LxlXC1MwrUvZUqZ9of8MMRftf8AhSH4aTeHNL0b4DfDj/iT+DLqX/kYPOh/115X018Nvgf4c/Z38HWnhLwlpcOj6JZf8sov/R01a1vby6PpVpa/88YYf9VU9f5meJHi1mPErdCs/wB1/wAu6Z62BwVGlqV6reIPEFro9j5slS6xrEWkWPmy18y/tIftARafBNFbS1+X8PZLWzPF+xpo7a9b2RL+2h8QPBHxg+DviHQfG0UM3h6CGaaaX/ltB5P/AC2ir8N7fR7rWPFUWl6bYXupXeqXfk6dYWsPnXt7/wA8a+n/ANtD9oiXxxqs3g2ylm8mCbztX/8AkOvXv+CF/gfS9Y/a98T6zfWsM134Y8L+dp1f6J+HOV43w74Ex3EFZ+0/5eUqZ8Tjq31rF06R5b4X/wCCJ37Q/iDw5Dfy6D4f02X/AJ8L+7rwD9of9k/4q/ssXHm+OvBGtaPa/wDP/wD8sa/pM8L+B5fEFjNLHWJ4o8PxahBd6XqVrBqVpN+5u7W/h86Gevy3D/Sl40wzpYzNaNOpSqnZWyajUf7o/CH/AIJz3GqfEi3l0aX994T8F3c2sQy/9Npq+n9QuZa9u+NH7A8X7OEOueLfg5oP/FM6nN9s8ReDYv8A0daV4jb6ha+KNKiv7KX7ZaTf6n/nvB/0xm/6bV/VPhZxrkfEOAqYrKXrVqfvKf8Az7qH8i+M2BzClnPtcX/C/wCXYW+sf8spa9s/Yn+E/gP4i/EiwsNW8K+HribULtIt0tlCdu5gM479a8IuPN0+u6/Zx8b3Hg74jWNzG7RyRzwsrKcMpHIIPY19zj71KLsfJcE4l0sxpX2P3B8D/D/Qvhn4ei0nw7o+maFpkBJjtLC2S3hQk5JCIABk81r1neEfEcPjDwtpuq24cQalbR3MYcAMFdQwzjvzWjX5k731P7OTTV0FFFFIYUUUUAFFFFABRRRQAUVyvxm+OPg/9nfwDeeKfHXiXRvCfh2wx9o1HVLpbe3iycAFmPUnt1r8av2/P+Dybwh4Bnl0X9nzwa3jW8GAdf8AEG+001DxnZCpEj8Z5Zk5HQ0Aft/XkXxj/b9+Bv7PV29v45+L/wANvCl1ENzW2p+I7S3nUevls+/9K/kz/aS/4LG/ta/8FANXey1f4i+K7qykyP7F8NLJp9ljPdIgN31bJrm/hv8A8Eifj/8AGZ/t8vha409Zf+WusTbSf50Af0uf8RNv7Dn/AEXS1/8ACV1z/wCQqpf8RRn7Cn/Rcj/4RniH/wCQa/Bbwl/wbxfEG7ijm1Lxl4Y03Pvmuj/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4c/8Q4uu/wDRR9J/8Fx/xo/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4c/8Q4uu/wDRR9J/8Fx/xo/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4c/8Q4uu/wDRR9J/8Fx/xo/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4c/8Q4uu/wDRR9J/8Fx/xo/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4c/8Q4uu/wDRR9J/8Fx/xo/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4c/8Q4uu/wDRR9J/8Fx/xo/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4c/8Q4uu/wDRR9J/8Fx/xo/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4c/8Q4uu/wDRR9J/8Fx/xo/4hxdd/wCij6T/AOC4/wCNAH7jf8RRn7Cn/Rcj/wCEZ4h/+QaP+Ioz9hT/AKLkf/CM8Q//ACDX4af8Q4/iP/ooWk/+C9v8aP8AiHH8R/8ARQtJ/wDBe3+NAH7l/wDEUZ+wp/0XI/8AhGeIf/kGj/iKM/YU/wCi5H/wjPEP/wAg1+HP/EOLrv8A0UfSf/Bcf8aP+IcXXf8Aoo+k/wDguP8AjQB+43/EUZ+wp/0XI/8AhGeIf/kGj/iKM/YU/wCi5H/wjPEP/wAg1+HP/EOLrv8A0UfSf/Bcf8aP+IcXXf8Aoo+k/wDguP8AjQB+43/EUZ+wp/0XI/8AhGeIf/kGj/iKM/YU/wCi5H/wjPEP/wAg1+HP/EOLrv8A0UfSf/Bcf8aP+IcXXf8Aoo+k/wDguP8AjQB+43/EUZ+wp/0XI/8AhGeIf/kGj/iKL/YV/wCi5H/wi/EP/wAgV+HP/EOLrv8A0UfSf/Bcf8aP+IcXXf8Aoo+k/wDguP8AjQB+2muf8FO/2Tf+Cpl1/wAIP8OviVp3i/xPdWs0f9lT6JqGnm7hIyctdWqA7WAx/vH1r8Mv26P2P9Z/YX+OEvhy98+bwnqc003hi/8A/aM3/TaGu18C/wDBA3xt8JvGNj4j0D4q2uka3o8kV3Z30enthfcc9frX6z/F/wCAHhz/AIKD/s5xaD4ttbKbxPZQwzTSxf8ALG7h/wCW1pX0WS5zVwisjxMdScK3tqZ+Bdvb3Wof8e0U00P/AEyhrV0/4X694oPlWWja1ef9crSav2+/ZX1/wlb65F8OfiR4I8F+G/ibpf8Ax6SxadDDB4oh/wCfy0r6V0/wvo2j/urLRtFs/wDplFaQ1+GcXfSqxeSYupl1bLPZ1Kf4n02ByajiqPtaVQ/Hj9l//ghvL+1h8D/DPi2PxvD8N5vOm03xRYeI/wD2jXY/Gf8A4IIf8M4eFIdfsofEPx3tP+W0PhKv1b8P/C+XR/GV3r17LDeQzQ+TaWv/AD5f89qt3XhbS7rVPt1lLNoWoH/VXNhN5Mxr55fSh5re2p+yuenQyD2X70/AXR/2wIvhPqs1h4J+CPhjw3q0H/LXxHDNNewf9sZqh8cfFj4l/tIf8jt4y1TUrT/nwi/c2X/fmGv18/bH/YO8G/tTiW58a6XDo/iH/lz8b6DD5P8A4Fw18JeKP+CY/wAVfhPqs0VlYaL4qtP+f/S7uvr8HxxRzul7bC1vaH7h4f1uFaa/fUvZ1f8Ap4fMFh8L7XSYfLtooYoq++P+CJ/wH/5Dni2X/U6pN5MNcb8J/wDgmf4y+KHiOGLxj5Hhvw9/y2iim8691T/pjDX6MfDfwfoP7N/w5hsIoodNhgh8mG1i/wCWEP8Azxr8y8UuJqWDyWrg6NX97VPT8ROK8uxFH+z8tqe0/wCfh2VxcVh+KPGFr4ft/NllrzP4gftQWGjwS+XLDDXzL8cP2uftEE0v2qCGKD/XSyzfua/l/h/gXGY+sfilavRpHrH7QP7UMVvbzRRS1+e37VH7XF1b6rLoOiS+d4mmh/fXX/LDS4a4740ftgX/AI4nltfCUv8A0xm1T/4zXkNvp9ro9j/02n/fSyy/66ev708H/o/0qNKlmOYUj5vG5ncmt9Pi0eD/AJ7Tf66aWX/XzzV7d/wTP/aotf2Z/wBtnw9qmry+T4e8Tw/2DqNfOviDxBmueuLf+2beaKX/AFX/AC2r+n+LuGKOb5HVySf8OpS9meDRxns63tj+qv4TeKItPnltbn/tjLW38QPA8WsQebbV+N3/AAS4/wCCn2qa94B0/wAGfEC68nUdL8qz8Ma7L/qfE8VfpH8P/wBsn7P5NrqVf5yYnKf7HpVeFOJKOlL+FVPo8PiKVV+1os3LjT7rR5+fOhmhr4+/bY/Y3v8ASNV1D4ofDew87Vv9d4o8Of8AQUh/5/If+m1fa2ofFjw544g82OWGGauOn8cWGn33+t/ewV+ZZVj814GzunmuU1dOxhnWS4PPcJUwuLpn5oW+sWvijQ4b+yl+2Wl7++hqbw/cf2fqtpLF+5r1P9rj9naL4T+MdQ+I3gSwn1LwnrU3neKNGsP9fpd3/wBBK0hrzfT7iw8YWMV/pt1BqVpP/qZYq/0n4G46wHFeVUswwr1/5eUz+OM/4YxfDOY+yqr91/y7qH7E/wDBO/4it8Qv2adM37zJpMr2RZn3FgMMv0ADBQPRfwr3OvgP/gjp8TpLbV9W8LzSIIbyA3cSs2CZEIBCjOMlSSeM4QelffleTj6Ps68on9NcNY763ltKt1t+QUUUVxnuhRRRQAUUUUAFfmp/wWS/4OQvh1/wTVnvPA/hC2g+IXxeEfOmpIRp2ikgYa7lUg5wciNOfUrxn5k/4OFP+DlBvg/fat8Dv2fdZhHiJVNt4m8ZQEOmlAjm2smBw0+MhpOi9F5yy/jD+xD/AME9/HX7c3i6S/Bn0/w1FL/xMtZlGAv+NAD/AI+ftO/H7/grl8dY77xfrOv/ABC8Q5ItNOiUR2WjqcA7IwBBBEcZJGMnryc19b/sh/8ABAre0Wq/FW/M0hORo2mHJ/Ov0d/YI/4Jo6P8KtFi0LwVoUNpGTmbUCf389foP8H/ANjfQfA8EUtzFDNNQB8Jfs7/APBP+w+G+lRWvgnwbZaDDD/y1ihr3nw/+xPr1xX2jp+j2uj+V9mihhq7QB8m+H/2D7q3g/ey1c/4YXl/5+oK+pqKAPln/hheX/n6go/4YXl/5+oK+pqKAPln/hhiX/nrBR/wwvL/AM/UFfU1FAHyz/wwvL/z9QUf8MMS/wDPWCvqaigD5Z/4YXl/5+oKP+GGJf8AnrBX1NRQB8s/8MLy/wDP1BR/wwvL/wA/UFfU1FAHyz/wwvL/AM/UFH/DC8v/AD9QV9TUUAfL3/DC8v8Az9Q/nUX/AAwvL/z9QV9TUUAfL1v+xfYaRPD/AGvf/wDgLDXoWo/s36D4X8OQy2Ol6ZND/wAtpZYfOrp/iD/x/wAVfHn/AAX51i98L/8ABHf4rX9lffNttcH0GRn+lAHvf/CDaf8A9AvRf/ASGj/hBtP/AOgXov8A4CQ1/Gp/w0F42/6HDxZ/4N5v8aP+GgvG3/Q4eLP/AAbzf40Af1nfGjxv4X8L+I5tLudL0SaX/ltFFD5M9bfw3/Z30v4waVFqnh+6nhi/1M1rdV+WH/BNfWLrxP8AszeA5b66nvJZtOhmmllr9gP+CeH/ACI0tAGV/wAMLy/8/UFH/DDEv/PWCvqaigD5Z/4YXl/5+oKP+GF5f+fqCvqaigD5Z/4YXl/5+oKP+GF5f+fqCvqaigD5Z/4YXl/5+oK0PD/7G+qeH9VhurG/ghmgr6WoovYTR8eftgfsEaV8efB0X9rWvkzQfv8ATr+wm8mfS7v/AJ7RS18Vah8ePiX+xvqsWg/FqWfUtE/1OneMrD/yD9rh/wCWM1fsfcFUt/Kk/fRTcV8z/tkfBfRtQ0m7iltYJtPvYf31rLD50NeJn/COU8T03QzGl73/AC7qHh16+Kyz9/hNv+fZ8waP+1hf3GlRS/2z9stJ/wB9DLFN50M9W/8AhrD7P/y9VwP7KP8AwTRi+O3wk8Zah4F8RT+A9Qm8RTQ6TgefZQQw18wftT/Af9qX9kDVLuLX7Cy8VaSf+Ypo1fzW/CHCYjFVKXtaf7up7P8AeH22Dzp1cJTqs+7dP/bY/sf/AKbVb/4bA8EW8Essml+TNX4/XH7dHii4n8qKWyhrP1D9rDxlrEHlf29BD59foWU/Rszn7EvuZjXzmlfU/XbWP2+dB0eCWXSNB8mavmr44ft8WtvPNLq+vQw1+eOsfEjWfEB/4mXi3WryH/nl51Yn9oaNb/vfK+2Tf89Zf31foeTfRnu/bZlVMK2df8+T6J+KH7fH9s+bF4bsJ9Sl/wCfq6/cw14v4o8Qa98UJ/N8SapPeQ/8sbWL9zBBXMXHjiK3/wCPaKs+41i61j/VefX7jwx4YcPZMva0qXtap49fG1ap00+sWujweVHXM6x4ol1Cqlx5Vv8A8fN1++/55RV6F8H/ANl/xv8AGDyZdJ0b+x9O/wCf/VP3MH/fmvvKuNVFWR4uNzChhaXtcXV9nTPPbi3+zwQ3V7L5MU/+pi/5717z8B/2L7/4gTw6p42in03wz/robD/ltqle0/Bj9jfwv8DxDfXv/FVeJ/8Altf3/wDqYP8ArjFXeeIbmXUP+Ws1eFWx3tT8V4o8S6uK/wBjyr93/wBPC34h8P8Ahz4geAIfC99o1l/Ydl+5tIrWHyf7L/6bQ1h+F/iR8S/gP+6/5Kd4Tg/8GkENGnwXVbn9sf2f/ra+N4g4XynPaXsswpHwuTcUZ3lFb22Gq3PQvhf+2h4I8cTxWsWvT+G9W/5a2Gsw+TPXr0Gj69rMHm2UsF5DP/y1im86vlTWNH0Hxh/yFtLstS/6a3UP76s63+C+l6PcebomveJ9B/6ZWGozeRX8+8Q/RyT/AHuU4n/wYfteV+NtP2X/AAo4b/wWfXdvrHijwvP5ssU8NfOP7QFx8FvhvPNdXt1qnhvxPqf+p0vwvN502qS1zusfC+68QwxRXvjfxpeRf88v7RmrR+H/AMF/C/geeWXTdLg+1/8AP/dfvr3/AL+10cIeCmY5XW9tVx3sv+vZpnXivlWPo+xpYX2v/Xw90/4JUeMvEXgrxd4KuPE0iWmrmZY5WbG0Rsdr5zwBtJ57V+yfWvxW+E+sf2P4xtJf+m1fsh8O9efxT4B0XUpAqyX9jDcMFGFBZATjPbmv2DOaPJKLPS8Ocd7bD1KXZ3NmiiivFP0kKKKKACvx9/4OXP8Agu1c/sc6G3wK+EmrJbfFDxBAra9q8RO7wrZOAV2nHE8inIP8Cc9SMfZX/BZ7/gqLov8AwSs/Y+1DxjKLe98Z64X0zwnpcgJF9fFc7mA58uMfM3rwO9fylfs1/A7xd/wUi/advLrUtQ1DU7/W7qXVvFWtTHLM082WYn1LHP50AdL/AME3f+Cdmo/tk+Mzqmqie28F6W2buYZBu8dhX9DH7D/7B9h/wjen2tlpcOj+GNLh8mGwrnv+Cf37E9hb6VpOjaRpcFn4Z0Wv0j8L+H7XwvpUNrbRQwww0AReD/A9h4H0mGKyigh8iteiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigDh/iT/AMf0VfGn/Bw5/wAoaPi5/wBcrT+dfZfxA/5CsNfGn/Bw5/yho+Ln/XK0/nQB/JFRRRQB+4n/AAS+/wCTWPh7/wBgmKv2M/4J7f8AInTV+Of/AAS+/wCTWPh7/wBgmKv2L/4J4f8AIjS0AfSNFFFABRRRQAUUUUAFFFFACHBxXyT/AMFF/jPF4W+HOty2P/H35P8AZtpFF/z9zfuYa94+P/xX0r4TeAJbrVr+DTYZof8Aj6upvJr4f8L/AG/9oj402njK9inh8BeEpvO0iK/h8n+27v8A+Mw189xDxNhOHsvq47GVdf8Al2jzq1Cria31WkfR37L/AIGi/Zf/AGZfD2gyf8fcNp503/XWb99NXgP7QH7QF1card6Xoks00t7N5M1TftAftIXWvz/2NpEs95NNXJ+H9Y8Efs36V/b3j/XrLTdWvf30Nh/rr2f/ALZV/Hec51iM5dOUaftP+fdP/l5UqH2VGjGgrMzrj/gmv8OfjBpXm+OvC+l6ld/+Ac9fBvxQ/wCCV/hz44fGLUIvgVr17o/g3w9+5mv7+HzoNUu/+mNfe9xb/Eb9vDztG/svVPhv8Mp//B14hhr6w+F/7EFh4X8HWml2MUGj2llD5MNrFX9JeD/DvEOUr+0c9xVWl/z7pHyWf5j9Z/c5ev8AuIfhZcf8EP8A4yW/+q8R+GNSqpb/APBGf40/89fCVfuR8QP2L9eME39mywTV4v44/Z3+IPhj/WWE1f0fR4hrf8/T4nG1s2wy0pn5P/8ADpfx5o//ACF/Fvh/Ta2/D/8AwS/0b/mN+MtT1KvuL4gfCfXvIl+02s8M1eZaho2s6PcTf6LP5Nekszq1f+Xp+fZnnOd1f3XtPZHBeB/2d/Afwft4f7N0Gy82H/lrLD509dDqHjiLP/LaaKrlvcRahP5Uv7mobjwvFR9YrM+ExuEnVq+0xb9qYn/CQf2hUP7q4q3ceF/s/nSx1k3Gn3Wn1l7f90c/1KkS1Fcf6RBUP2iW3/1kVTW/m6hS9sH1Ii0/T5biur0/R6PD+jy10Vvp8tvRWYVqJTt/D8VxWvb6P9npLe3rRtqDahhw0f8A4l99aS/88Jq/WP8AYn8Xr4y/Zx0CbzWlltVe2k3ZJQqxKrz2CFcY4A47V+U/2f61+hf/AAS08VPqfwx1zTCF2WN0kyn+Il1IOfb92P1r5/O6VqSZ+s+Glb2daVB9V/wT6kooor5c/ZwqDVNTt9E0y4vbyeK1tLSJpp5pWCpEiglmYngAAEk+1T1+Vv8Awdgf8FFE/ZP/AGDm+F+iXKp4y+NPmaXgDm20tcfapM9i2UjHs7+lAH4lf8Fuf+Cimp/8FZP+CgV5qugrd3Hg/R2/4RjwTZEbS65G+Zh/fkkYsc9AUHav0c/4JQfsERfAj4d6V4diigl8Q6p5U2uSCvzu/wCCHP7KR8dfFSb4janEf7P8M82HPWav6Ov2B/gP/Y+lf29fRUAe8/Bb4X2vwv8AB0NhZReT5MNdbRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAcP8Qf+P+KvjT/g4c/5Q0fFz/rlafzr7L+IP/H/ABV8af8ABw5/yho+Ln/XK0/nQB/JFRRRQB+4n/BL7/k1j4e/9gmKv2L/AOCeH/IjS1+On/BL7/k1j4e/9gmKv2L/AOCd/wDyJs30oA+kaKKKACiiigAooooAKKKKAPlf/gpb+zx4o+NMHgnXvBxt59W8Cal/aUOlX/8Ax5an7V8zfFC4/aR8cf6LY+CPD2g/9NZdRr9P7m2iuoPKl/exVk3Hw30a4n82Swhr5vOeDsmzirSxOY0vaVKX3GPtcVT/AHdGoflX4H/YX+NPjC483xT43g03/plo0NfR/wCz/wD8EtvDngfVItZk0afUtW/5/wDVJvOmr7LtvC9jo/8Ax72sEP0rQIb1Fe1hMry7ANPCUadOx539m1qn8ar7Q5nwP8KNL8EQReVFDLNXUUUV1Vqzq7no0aFKkrUgooooRta+5j+IPhvoPiGD/TtLgmrzLxv+w/4N8UD93F5Ney0VtRr1qZxVsrwlb+NSPiL4of8ABL+X/W6bFBNXzV8QP2T/ABR8P5/KubWv1yrN8QeF9L8UQeVqVrBeQ/8ATWGvSo5zVpHyuZ8C4Sr/AAT8Y7jw/dafP5VzF5P/AE1qH+x4rgV+l/xg/YH0HxxBNLpvk2ctfF3xw/ZH8R/Cf/llXsYPG0qu5+ZZzwXi8N/BPFrjwP8AaKmt/B9rp89W/wC2LrT5/KvovJlqG41iW4nr0l7I+a+o1upof2fHRb28VVbjUKp/2hLb0XpDoZYdF9ni96qfZz70W+oVoW/9aPbnpUMF7Mlt7eU19mf8ErNeMXirU7JHxFd2LyMuBy0cqBTnrwHb86+SdP0+WvoD9g3xK3hT426Uy7yt232V1DlQwf5efUAkNj/ZH1rxswvUon13DX7rG0qrP0Uooor5Y/aAr+PL/gvN+2zd/wDBSP8A4KfeK9W0F1vfDOiXI8HeFXThZYLdzukB6/vJWkf2Egr+nb/gsJ+13L+w5/wTe+K3xEsbkWuuabo0lporkAkX9x+5gIB4O13D/RDX8pP/AASK+BP/AAuX9rLT7yQn7B4Sj/tJwfb/ACaAP2O/4JjfsoRfC74c+CPBsX/LCGGbUf8ApvNNX7GeB/D8Xg/wrDYW37mGGGvkT/gnf8L/ALRqsus19pUAFFFYXiDxR/Z/+i2376agDWuNYtdP87zZaxLj4oWGn1zFxo91rA825l/19ZPii30vwPpUt/q1/pej2n/P1f3fkwUAdP8A8Lotberen/GDS7j/AFsvk189ah+1R8IP9VF8Vfhx/wCDyGprjxBYeINKhutIv7LWLSf/AFN1YTedDQB9S6frFrrEHm20vnVPXyn4f+IF/wCH7j/RpZv+uVep+D/2kYv3MV9QB6zST6hFp8Hmy1naP4wsNZg822lhmrD8caxm+hik/wBVNQAus/Fi10+s7/hdMX/PtPXO/tE+O/A/wO+F0vivxR4j0zwr4es5Yoru/v5fJgg83/VV82f8PV/2Zf8Aovnww/8ABjQB9bf8Lwtal0/44WFxP5Un7mavkT/h6v8Asy/9F8+GH/gxrD8cftgeF/HGuRf8ItrMOsadND50N/YTedBPD/z2hoA/Q631CLUIPNj/AH1Q3GoWunwebJLXkP7N/wAULrWPgrFdS+dNNPN5MNdDPo91rE/m3Ms3lUAbmofFCw0+s/8A4XRa+9cx4ot7DwfpX2/Vr+y0e0/5+r+byYa8n1D9qj4QW880X/C1fhx/4PIaAPonT/jBpeofupZa6HT9YtdYg822lgmr5guPEGl+INK+1aJf2WsWn/P1YTedBR4X8cX+jz+bbSz+V/zyoA+rKK8g8H/tExfuYr2vR9H8YWGsQebbXUM1AHP/ABJ/4/oq+NP+Dhz/AJQ0fFz/AK5Wn86+0PiQfs99aV8X/wDBw5/yho+Ln/XK0/nQB/JFRRRQB+3/APwTC/5NZ+H3/YJir9kP2L7iL4f/AAy82+/cy6pN+5i/6Y1+Uv8AwRA8EQ/Ff4f/AAd0I8edp1frX8Z/iR8Pvgf4ph0bxB4y8I+Gz/rorW/1GGzm8qgD1L/hcNh6Uf8AC4bD0r58/wCGqPg//wBFV+HH/g8ho/4ao+D/AP0VX4cf+DyGgD6D/wCFw2HpR/wuGw9K+fP+GqPg/wD9FV+HH/g8ho/4ao+D/wD0VX4cf+DyGgD37/hcNrVvw/8AFfS9YvvK83yZq+dv+Gr/AIQf9FU+G/8A4PYq838UftEaXqHir/iSX8F5D53nQ3VrN+4noA++aK4f4D+Of+E48D2kstdxQAUUUUAFFFFFgCoLjWItP/1ktYmv+MP7P/dW376auYuPD91rE/m3MtAHQ6h8UbXT6qXHxotbeuT8YW+l+B7H7Vrd/pmj6f8A8/V/d+TBXk+oftUfCUTzRR/FX4bzTf8AYchoA+idP+MGl6hP5Xm10NvrFrqEEPlywzV8y3GsWHiDSvtWk39lqVpP/wAvVhL50NTaf4outH/49pZ4aAPqGivFfC/7QF1p/lfbovO8iu98PfGDS9YoA62qXiDw/YeIIJrW+tYLy0m/5ZSxVct9Qi1CD93L51LTQmk9z5Z/aI/4Jz6X4w8260D/AMBa+KPih+zfr3wvnlilin8mCv19rB8cfDbRviPZS2upWsMw/wCen/LavRoY2rSPlc04Yo4n+CfjJ/Z0vrUtvb19z/tEf8E9+Jr/AET99Xyf4g+H914P1Wa1uYvJ8mvYo42lVPhK+SVcLVOZt7etvR/K/wDjNFvo8tW7fT/s9be2MaNC5rafB9nr0H4GeKovB/xK0m72eZ9knSbZuxv2sDjPbOK84t/Nrc8H+bb65DL5tYV637qx6eAo+yrJn62RuJI1YdGGaKqeHdSh1jw/Y3du/mQXVvHNG2CNysoIODyOD3or5Y/WEfiJ/wAHrP7SQ0P4JfCL4SxAH/hI9Vn8SXxzysVqnlR4+rTSf98ivjb/AIIO/CF7f4Pa74qc5n8Q6j5Y9gOK5/8A4O3/AI5RfFr/AIK4alocKbU+H3hvT9AZ8/feQPdsfw+04/Cvsv8A4JZfCJvCn7Pvw+0NDlmtYpyfU0DP1q/Y38H/APCL/CS0lr1+sf4f6R/Y3g60tf8AnhDDWvcXH2eDzaAMnxBrH9nweVF/rp6Twv4P+z/6Vc/vpZ6z/C//ABUHiqaWX/VQ1+dH/BzL/wAFZJf2D/2aofAHhC4EXxF+JMJAOP8AkF6eOCfr1H5+tAHlX/BaL/g5lsP2Xtb1P4Z/AA22t+M7f/kI+I2/f2emnjgDuec+n6V+BP7Qf7ZPxQ/at8Ty6p8QvHPiXxVdy/xX+oZx+HSvN7m/luZpZfNllM3+tkk5zVGgC39vl/56zV6V8AP2wPiV+y94ii1jwJ4x1nw5eDvDN1ryqigD9nv2Ov8Ag59y8Wi/HHw7E/zY/wCEh0JcP+K//rr9Pv2eP2sPhz+1h4dh1n4eeMtF8VRf9MpvJn/7bQzfvq/kjrpvAPxN8R/CXxJDrHhbXdR0LVoP9VdWE8sM35igD+wnR/EF1o99/oUs8Neg+F/iT/wnHkxXvkQ6jB/qZf8AnvX86/7HP/By58RfhO0On/FnR4PiRouSDfEiHUx+Pev1e/Y5/wCCn3wX/bGghl8DeMbODxD/ANAbUP3F7QBq/wDBy5/yhY8ff9hDSv5iv5RK/qp/4OMNfj1//gid8QGH8OoaSP1H+FfyrUAFfvJ/wTvt/tHwB+G//TfQ7SGvwbr+iD/gil4KHjW2+CVlMcAabk+1AH7G/A/4X/8ACD+ANEi/58rTyfKr8sv+C2P/AAcpaR+x5rWp/Db4Ji28ReP8Y1HXG5g0c8fKOOTzXsH/AAci/wDBVq4/4J1fssReFPCtwY/iH8RBLb6fKFH/ABLLX+Jv6fnX8p1/qMusXEktxJLLNNL5sssnegD1P9or9uX4sftZeKJdT+Ifj3xJ4mn9Z7s8fhXlH2+X/nrNVSigD1H4EftW/Eb9nDxRFqvgbxlr3hu8h6G0uJRj8K/Tz9kT/g52vrbytH+Nnh/7TBnH9u6ENrj6j/DNfjlRQB/Wv+zP+2T8Of2uPDkOqfDvxloviT/plFN5M8E3/TaGb99Xq+j+KLrR5/8ARrqaz8mv49vBHj/Xvhp4jh1Pw/rGpaHq0H+qubGeWGb8xX6PfsW/8HKPxM+DS2+jfFSwh+JHh6M4y2F1IH6k4oA/ou8L/FH/AITCCGwvv+PuD/Uy/wDPevmv/g4c/wCUNHxc/wCuVp/OuC/Y5/4KrfBL9sbyZfBXjKDTfE//AEAdU/c3prpv+C83ij/hJv8Agin8W37rDaf0/wAKAP5OaKKKAP31/wCCH/ij/hBvhz8HL/8A6dK9g/4ORP8Agnw/7W/7Jg+I2hQmfx18K4ecddT0ivm//gl1deV+zD8Mz/zy0+I1+yHh/WLXxD4ctLqWKG8h1O0hmmil/wBRPDND++hoA/ix+0y/89Jvzo+0y/8APSb86+0P+C3v/BPx/wBgj9svWdP01D/whXionUvDzg9VOOMfXP518UUAT/aZf+ek350faZf+ek351BRQBb+3y/8APWav2/8A+CNXxvHxP/ZL8PxXmTf+GJv7HGa/DWv0M/4IKfGNvCvxZ8QeDyCBrcUV1D9Rjj+VAH9In7C/jH7RpU1hX0hXw5+xB44/sfxlDF/z+w19meKPEH9j2MPl/wCumoA16K8r8UaxrOn/AOtl8msn/hIdU/5+ZqAPaqyPGGsf2fY+Vbf66evJv+Eg1T/nrNXT/B/xB/wlHiqawvZfOlsv31AHZeH/AAf9ng825/fTTV+QP/Bav/g5jsP2Ydd1L4bfAb7NrfjOEY1LxEw3QaaeOAO55/8A1V6r/wAHNn/BV6T9hb9muD4d+Drjy/iJ8SYtucc6Zp44Y/XqP/11/LLPcSXB56UAeo/tB/tm/FD9q3xNJqnxC8c+JvFV9IfvX1+SB7eleZ/b5f8AnrNVSigD0/4IftbfEv8AZs1uO+8C+N/EHhWcf9A+8lhr9Dv2Yv8Ag6N+JfgzytP+K3hzS/Hunjg38OLPUvzFflFRQB/T3+yz/wAFq/2ev2rVgjs/GEXhTxA3TTPEfQ49K+tLe5/tCCK6tpYby0mh86G6tZvOh/7/AENfxrfaa9+/Zi/4KW/Gn9j2cP4H8c6pa2qcNYy/vrQ/gTQB/WN4f+IOqaP5X2a6nrt/D/7REv8Aqr2Kvwk/Zh/4OoxtNl8XPAAZckS6p4dIDfl/+uv0b/Zo/wCCj/wS/a/P/FA/EbTLvUf+gXf/ALm9oA+/fC/xI0vWPJ8q6groDcRXFfKv2iXT54f9fDLXQ+H/AIsapo/7rzftkNAH0XXkHx4/ZP0b4oQSy2MUMOo1reB/2gLXWJ4bW9/cy16R/wAfEHm1rRreyMa9CjiaXsqp+aHxA+C9/wDDfVpormKeGGCuZt9Hr9I/ix8H9L+KGlSxXMUH2v8A5Yy18c/FD4H3/wAONVliubWvTo1/anxONyX2X8E8yt9ArQ0fR/Ivoq6e30eWrdvo/wC/irasclCjqffvwfk834UeGm9dLtv/AEUtFZn7Ok73PwX0JpHeRhE6gsckASOAPoAAB7CivCe5+iU/hR/HX/wUn+I3/DU3/BWf4m+JBEII/EPjWSKKLdu8tFIRVzxnAUc45r97v2H/AIfxW/jHRLD/AKBfkw/9+a/nj+BdmfHH/BQrRonk80XniuaQn1+Yn/P0r+lj9gfR/tHxUpFn37b2/wBnsYov+mNReILj7PpU1XKzfFEH2jSpaAMPwPcf6r/ptNX8pn/ByP8AHWf48/8ABWf4mAHda+Ep4vD1qP8AdGf6mv6mPDGs/Z76H97ND++r+TT/AIL1fDOf4X/8FYvjRD1XU9cm1gewu/moA+M6KKKACiiigAoruvgN8EtU/aA+Ken+EtKkhju9TlwMngV97+Gv+DfKTW9Mimk+JNuuew048UAfmdWppuo3OjX0VzbTTQ3UBzFLFL5M0Rr9Lf8AiHT/AOqlw/8Agvo/4h0/+qlw/wDgvoA+afEv/BXn42eNf2R9e+C3iXxI3ifwdrphI+3DM9sYTkYP4D8q+VK/SP8Aas/4IDav+zF+xb4k+MzeNLfVLHw5cQwKqrySewr83KACv6Y/+DcfR/tEHgK6/wCeHhKv5nK/pj/4N19Y+z+FfDH/AE28JUAfl5/wdCfHe5+NP/BWLxhpzY+xeB4IdCsgvsMn/PtX5v192f8ABxH8Lbn4c/8ABWn4pY+7rU0Ws/hdjNfCdABRRRQAUUV2fwX+EOqfHj4m6V4X0j/kIapN5MUkvSgDjKK/Svwh/wAG/c3ijRop3+IsCZ7DTzxWt/xDp/8AVS4f/BfQB+Z2nX9xpFzFc200tvLCf3UsUvlSivqC5/4K/wDxv1X9kzxL8Gde8SXHifwZ4rPP9p8zwc9jX0j/AMQ6f/VS4f8AwX0f8Q6f/VS4f/BfQB+X1FfqB/xDsf8AVS4f/BdUf/EO0f8AopUH/gvoA+iP+CX3/JrHw9/7BMVfrh+z/qEus/AjQ5f+gZNNZzV+aP7M/wAD/wDhmfwd4e8GyX/9pf2LD5P2+v1E/Y30f7R8FruK+/cxapN51pLLQB8xf8Fqv2C4f+Cgf7Fev2Vnp5uPHfgqKXWPDwBxuHcZ9xX8sF1by6ZNLFJHLFND+6ljk6j2r+1gW91o+qyxS/66Cv5z/wDg5B/4J3xfsrftZReP9AhWLwT8VZS65P8Ax56gOZ1/mfz9aAPzJoqfn2qCgAr1j9jn4sy/A/8AaX8HeIlyFs9SiimHrFL+5lP5GvJ6n59qAP6pP2d/GEWn+MdPuraX/ltDND/1xr738Qax9on06X/ljNDDNX46f8EwvjafjL+yz4J10j/TLe0/syav1q8D6x/wkHw58M3X/LXyfJmoA8W/4LQ/t5ax+wP+wfffFPQtC0vW9astXtLLyr8fKMnrX4zf8RgPxg/6Jr8PfyP+FfpD/wAHVP8Ayho8Q/8AY0aRX8r9AH6/f8RfXxb/AOiZ/D78jX6p/wDBHj9sDXv2v/FVp4y1uKDTZta0KGaawir+S6v6c/8Ag3H1iLR/B3hj/sV4aAPyL/4OQ/2hLz9of/grB8RSSWsfCkkWg2C+iqAf1yfyr4Ar7N/4Ls/DLUPhl/wVa+MkN2ebnW21Ig9hdDdXxlQAUUUUAFFFd18BPghrH7QvxS0/wnogze6meM9KAOFor9MPDH/BvjJ4i0SK6/4WTbqD2GnHirn/ABDqS/8ARSYP/BcaAPzDq/p1/caTe+dbzT28sJ4kil8mX/Gv0t/4h1Jf+ikwf+C40f8AEOo3/RS4P/BeaAPEv2W/+C5/7RX7K4jsbDxlP4k0QH/kF67/AKav681+kP7K/wDwc7fDT4oCGw+KPhybwHqP/P8A2H76yr5L/wCIdRv+ilwf+C81J/xD8xeFp4brUfHn9o6eP+WcVpQB+vdv+0BYaxqsUtjfwzQz/voZYpv+WNfbn7M/xAl+IHgCKWSWvyP+A/w3uvC8FpYW0Xk2llDDZ2kX/PCKv1g/ZA8Hy+D/AIVxRX3+tnhoA9Zrkfix8N7X4gaHL5kX76D/AFMtddUF/wD6iWmmKtQ9qfF3iD4f/wDCP6rLFJFRb6PF+68qKvafEHheLxB50X/LaGb9zXG/2P8AZ569GjX9ofL1sF7KsfRX7PcXk/B/R19Fl/8ARr0Vu+AU8vwPo6+llCP/ABwUV5z3Pp4K0UfxQf8ABPf/AImP/BQvwH/0210D+df04f8ABO+3/wCKxr+Y/wD4J8/8Sj/gob4Bjk/h8RYP5k1/T3/wTvuIrfxjSKPt6kuIP7QgmipaKAPFfEHm+H9cmtf9TF/yxr8jf+Dnj/gnbe/HTwbZfHHwjpxuNe8KQGHxOAceda44P4f1NftT8WPA/wDbFh5tt/roK8G8QahdW5miuYv+mM0UtAH8ZdFftL/wVf8A+DfGLWF1v4lfAYZAzPqHhIAZ/wC3T1r8b9W0e78P6rLY3sE9reW8vlTRSxeVLBJ7igDKooooA9s/YJ+N1r+zx+1Z4U8SalmPSoZ/I1Aj/njKOf6V/RR8J7fRvs9pFJ5N5p8/76GWKb/lj/z2r+Wuv2V/4Ia/txn4q/DhfhZr90Tr3hQZ004/19p3H4UAfrHo/wCzPL4wg+1aBLBqUP8Ay2i/1M8H/XaGtvw/+xvL/asMviDyLO087/VRf66euY+A/wAWJfA3iOG6jlm8mb/Xf9ca+sfFGsRaxBp91HL50N7DQB8Lf8HJ9vFbf8ET/HUcXQahpP8AMV/KXX9Xf/By5/yhY8ff9hDSv5iv5RKACv6If+CJ/ij/AIRfQ/hP/wBNtDhhr+d6v3k/4Jz3Euj/AAI+G8v/AD5aRaTUAeg/8HLX/BO2/wD2pPhVpfxd8H6eZ/F/gGGaHXYs/wDH5p/Y/Uf1NfzwTwYNf2Xf8JB/bFjFfx/6nU7Tzv8A7TX5Cf8ABWj/AIIERfEj+2/iX8CovJ1AfvtR8G//ACJQB+I1Fa3iPw7f+Edbn0vUbWey1Gyl8qa2mi8qaCT0NZNABXrf7F3xlt/gJ+0x4T8UXoJ07T9QiN39K8kooA/qP+C+oaNcaVFL5UGpafqcMM1pLFN/yxr2Pwv+zfL44gluvD8sOpQ/8tov9TPBX5Gf8EK/25f+E38Hf8Ki1+Qy61oEXneHOD++i7iv1o+A/wAWJfB/iOK6jloA3P8AhkDxH/z61D/wyPr1v/rLWvtHwtrFr4p0O0ltv30U0NReINYtdHg/dRedNQB8W/8ADG+vf8+sEMVbmj/sH5/4/tU/8BYfOr6l0fwvdax/pV9L503/ADyr5X/bz/4K1fDn9iPxFF4P0iwufib8V2wR4S0IYI4/113L/qYfx5oA6TR/2J/BujarDf3NhNrF3B/z9f8Axmux1DR7q38m18qaGH/lj5UNfmN8UP2mP24f2sPhX4n8R+FvEfhLwHD4f/0yXwl4ch869ntP+mM03/LasP4H+D/iN+0R4A0nxl4O/av+MWpf2n/qYpYYaAP1AuPFH2fyotS8+8h/5ZS/8t4K8i/4KHfsQ6P/AMFBf2PfE3w6vT/xMdT/ANM8O3//ADx1GGvjTxx+0/8AtZ/sP/tE+HvBHjKPwn8bPDXi4/8AEj1TEOjXmqS/8+f/ACxh86vp79j/AP4KIeEvjxPqEWm/2no+o6ZN5PiLw5rMPk6p4emoA/ld8f8AgHVfhd4y1Xw5rdtNZato13NZ3ltJ1hli4rm6/Zb/AIOlP+CecfhLxdp/7Q/hfJ03xefsniHn7t561+NNABRRRQB+qP8Awbw/GYrF4y8BTcEeVq9pX76fsn+J5fEHwrii/wCgZdzeT/22r+Uv/gll8dT8Bf20fC+oSjGnapN/Zt5/1ylr+mz9g/xR9p1XUdL/AOf2HzoaAPHf+Dp7/lDH4h/7GjSK/lkr+pv/AIOnv+UMfiH/ALGjSK/lkoAK/oy/4If+KP8AhF/Dnwyi/wCgp4dhhr+c2v31/wCCa+sS6P8AA/4W3/8Az5aRDQBof8HOH/BO29+Ovg2x+OPgzTjca94UgMPigA4861xwfw/qa/n6r+zTWNY/tCCGWP8AfWmqWnnf9d4Zq/HX/grL/wAG+Q8TrqXxK+A8Of8AltqHg4cEf9enrQB+KtFaus6FdeGNUltL2K4s7uzl8qaGWLypojWVQAV7j+wD8b7X9nj9q3wn4k1MGLSYZvI1A/8ATGUf/qrw6igD+pr4T/2N/ZVpFJ5F5aTQ+dDLazf8sf8AntDXr2j/ALN8vjCD7VoEsOpWn/fmaCvyc/4Id/tyf8LO+HI+GGvzE6/4TH/EtOP9fadx+Ffq7+z/APFiXwN4jiljl/0T/ltQBNcfsn69/wA+FRf8Mna9/wBAs19t+F9YtfEGlRXVt++8+GtHyYqAPhP/AIZO17/oFmobj9j/AF7WIP8Ajwr7y8mKjyYqAPmX9nf9heLw/PFf63X0pb6fFp8EMUf+qhqeigAptz/x7S06m3NAHmWn3H/E8u4vK/5bV8Zfthf8Ff8A4X/sb/tzax8Nfikbrwxp0mkWepaVqiqTivtPR/K/tW7ll7TV/Nt/wdx3Xn/8FXG/6Y+F9O/kaDKtRVXU/pY/Yj/aa8MfthfsweGPiH4NuHvPDOtC6gsZ2GDMtrdzWhf6FoGI9jRXz9/wbpeE38Ef8EYfgfpsgIeKx1GT6iTVb2QH8nooNT+V34STyfC7/goxpxn/ANZpvjeWCX6/a5YTX9NP7C9x9n+Jtfzu/wDBXT4WWX7Ln/BYT4q6Bo7zLp2heK4bqAykFwskccwyQAP4/Sv3x/YX8cRax4q8Pap/0FLSGaH/ALbQ0AfpLRTbb/j2ip1ABXA/Fj4PxeKIPNtovJmgrvqKAPk7xRo91pF95VzFND5H+pr4T/4Kf/8ABGjwR+3tpU2vaR5HhX4pf9BP/lhqn/Xav118cfC+18cWE3mxV4B44+G914Xnl8yKbyv+etAH8in7R37L/jX9kX4n3PhDx1oc2h65b84IzDPH/wA9Ype4rzGv6vP2xv2Ifh/+3N8LJfCfj7R/NP8AzDtUi/4/dLlr+fX/AIKQf8ErfHP/AAT08Ybr4SeIfBeo4Om+IYV+WT2Pof8APFAHybXc/Ab4zaz8APi3ofi7QJvI1bRbuKaE1xn2aoaAP6af2T/2kNG/aI+Evh7xloEsE2n61D/4BXf/AC2hr7m/Z38cf8JR4AmsJZfOm0ub9z/1xmr+aj/gij+23/woT4zH4fa/OyeF/Gc2FYqV/s2/6A/pX76/sj+OP7H8fxRS/wCqvYfJmoA43/g5c/5QsePv+whpX8xX8olf1bf8HLf/ACha8ff9hLSf5iv5SaACv3f/AOCd/wDyb38PP+wFDX4QV+7/APwTv/5Nz8B/9gOGgD9W/wBl/wAH/wDCyPgh5X/LbS5pvJlqp4o8P3Wj3/lXMU0Pkf6quy/4J/8A/JOBXrvjj4b2vijSvKkioA/Jv/gpZ/wR88Cf8FA9Lm1mLyfC3xLJBj1wk4b2mhFfz+ftOfsk+Ov2Nfird+DvH+iTaRq9ucjIzDPF/wA9Ype4r+uj4gfC+68H30vmxedDXg/7V/7HPgT9tb4Sy+E/H2jw6iR/x534/wBfpc1AH8nFFfYP/BS//gkr46/4J5+KXZifFPgWcg6d4hhGFf2OOlfH1AHYfCD4r6z8D/ibonizQJ5bPVdEmjmhlHrX9FH7G/7TGjftQ/B3RPG+if6rU/8AXRf8+V3/AMtoa/mnr7o/4Iw/twD9nL40/wDCHa/N5Xg/xlNtJ5/4l112b8v6UAf0z/sf/GDPlaDcy17doGn/APCT+KppZP8AVQV8EfCbxhLo/jHSZf8Anyu4a/QPwPqH/kb99QB8a/8ABaP/AIKRX/7JnhDSfhz8NZID8YfiP5sWnSf9C/ac+dqJHtXzR/wTX/4JIXXi/wAOy+I/EEuqQ6dqn+mXes3/APyE/FFc5+zPoul/8FA/2/8A43/tD/EC9WD4Z+EdRn06C5l4gh0rTuf51yv7WH/BRf4g/wDBSnVptG8E3+p/Cv8AZ7g/cwxWH7nWvF3/AMZhoA+zPih+3x+yh/wT387w5J4jgvPEP/QB8Of8TPU6/Pb4a/tD2Ph/9vPxNL4K8J+Ovhx8M/i3/wAVV4ei8Rab9i/4m8P/AB+eTXun7G//AATnluILSLwl4Sg8N6JN/rb+ut/4LkfDfS/g+f2StG0n/lh4o1GGH/wW0Ae3fGj4D6D/AMFIP2JtR8OSfubvVLTztOl/6BerWf76GaGvjn4UeB9U/wCClHwBtPGWkyw+D/2tvhJ52m/2p/0FJrObyZtNu6+3P+CW+sS6x8MtW/6YajXx98J7iX4D/wDBY/486DH+506bxbaal/4GQ0Aem/sr/FHw5/wVI/Y08T/CDx1Yf2bqF7DNo+r6Xf8A+v0TV4a/nA/ai/Zy8RfskfHjxL8OvFEE0Gt+GLuWzI9a/oT/AG4PB8v7G/8AwVX8M+PNA/c6J8ddOm+1/wDYcs68G/4OZ/2Fbf45/Bbw5+014RVnfTbeLTfE4DYxbYO0/gf60AfgrRU32aoaAL1tdy6dNHLFJ5UsMnmxe1f0z/8ABJL9oU/EzwH8NPFbAhtYtYoJwe1fzFV+vH/Bvp+0E158Ndd8IMcz+FdSi1TTz60Afo9/wdKf8oZvEv8A2NOkV/LTX9Rf/Bz7deb/AMESdaP/AD18R6Ga/l0oAK/er/gnh/ybd8Pv+wFDX4K1+9P/AATw/wCTc/h7/wBgOGgD9Yf2d/B//C0fgRaRf8tdMm/cy/8ATGue1/R7rR77yrmKaGaGavQv2Dv+SVivTfHHwvtfGFj+8ioA/Ir/AIKf/wDBGrwT+3tbza7pHk+FfiicE6n/AMsNVr8B/wBo/wDZf8a/sm/Eu+8H+OtCn0PXbI/MpFf16eOPhtdeD77/AEmLzof+WMtfPf7ZH7C/w+/bo+GU3hzx1pf/AGDtUi/4/dLloA/lEor6x/4KPf8ABK3x3/wTw8YmPVh/bvhC9I/s7xBCPlf6/wCfyr5OoA7j4EfGnWf2fvi1onjHQJZodW0WbzoTX9GP7J/7SGjftH/Czw94t0WXzrTxBD/4BTf8toa/mWr78/4Ioftqn4C/Gz/hX2v37ReF/GkvysVx/Zt/0BoA/pZ/ZH+LH/MGua+i6/OD4X+MJdGvopY5fJmgmr7x+C/xAi+IHhW0l/6Y/vqAOuooooAKKKKACoLj/R7Gap6p+ILj7PpU1AHEeF7f7Rfy/wDXav5cv+DnbxQni3/gsZ8Qsfd02Gx07/vlCf61/VF4At/9VLJ/z186Wv5EP29Wu/23v+CzPjnTbXmfxv8AEl/Dmm5OFBe+FsufbLfrQB/Wv/wT38AzfC79hr4S+H7g5n0vwrp8L/XyEP8AWivXbCxi0yxhtoEEcNuixxqOiqBgD8hRQB/Lh/weJfB+3+Hn/BVXTfEUIYf8J74PsL6fkkeZBLLak/8AfEKV9qf8Ef8A40RfEj9lD4W69/0C7SHTZv8ArtZ10H/B6N+zcPGv7Hfw3+KUUji58A69No8kYxtaHUo1BY9+HtkHH96viL/g3W+NjX3ww8UeDG66FexapF+JoA/pP8H6j/bHhy0l/wCe8VaVebfsz+MP+Eg+GVpL/rvIh8mvSaACiiigArN8QeH7XxDZeVcxf66tKigD5/8Aih8D5fD8811YxedDXkXjj4f6N8SPB+o6D4k0ay17Q9UhmhvLC/h86Cevtu4t4tQt/Kkryf4ofAeK4866sqAP5vf+Cqv/AAQN1j4DJqHj/wCDkU3iLwH/AK270gfvb3RAex9RX5gz28lueelf2Maho0uj3E0UsXkzQf66vzV/4Ko/8EGNB/abl1Hx18JoIPC/jk/67Rf+XPWenIPY8UAfgnbzyW00cqdR0r94/wDgkD+3sf2lvghpMV9cmXx54Lmih1HP/LeH/ljNX4c/Ef4Z698IfGF/oHiXS77Q9d0qbybuxu4vKmgk9MV6J+xJ+1FqP7Hf7Q2i+L7RWktkJg1GE/8AL5ay9RQB/SR/wch63Hrf/BE3x1qQ/wCYjeaQf1r+U6v6Tf8AgrJ8ZtP+N/8Awbs+LtT0iXzrFNR0kKfTJH+Ar+bKgAr93/8Agnf/AMm9/Dz/ALAUNfhBX7v/APBO/wD5Nz8B/wDYDhoA/YH9gD/kmctfQFeC/wDBP7/kmJr3qgCnrOj2usWM0VzFDN59eI/FD4L3Xh8zS2MXnQ171SXFvFcHypaAPijxx4H0vxx4Vu9B1vS7LWNE1OHybuwv4fOgva/FD/gqt/wQLvvhFbah4/8AgtFPqfhj/Xah4e63Gk//AFq/oz+LPwPi1Dzrqxi/0uvF9Q0e60e+8qWLyZYKAP44rm3kt5vKk60kE+DX7/f8FU/+CD3h39qxJ/Gnwwhg8L/ERjmfTj/x5a17j0NfhJ8T/hR4j+C/jjUPDfinSL7QfEGly+Vd2F1D5M0BoA/bH/gjz+3f/wANQfAKLQdWvjL428GRQw3ef9fqlnX7OfC/4gS6x+z1NrMX+ustDu/+/wBDDX8cv7G37T+sfsg/HvRfGOmsf9Gl8q6i/wCe8XGRX9U3/BM/9ojQfix8OYorGWCbw94gh/tKzl/6Yzf66GgD8mdI+I0PiD9in4Q/s/6SB9g1OCb4g/EmXH/ITlmmm+yabL+n5V+nX/BOD/gnRFf6HaePPG1h0/5BOl18Ef8ABL/9ie18H/tbePPhzrf+u0X4lTabdxf9Mf8AXQ19Xf8ABcn/AIKB+K9HuLj9n74Iwamtx4f0qLU/iHqWgYOp6JonI+y2n+0R39OPXIB7J+1f/wAFmPgn+zB4ym8G6TJ4g+JvjvTP9b4c8ERef/ZlfBv7Sv7Svi3/AIKC/t+fD6Xxt4I1P4M6Vpvh6Y+B7HXpf+Qrdzf66u4/ZP8A2T/AZ+Enh6/+HmswzeE9ah86GWL/AJb/APPbzv8Apt/z2r6l/aQ/Y/8ABvx4/Z6tPBuvxT3mk6Z5M2napYTeTNpd3D/y2tJv+WM1AHrH/BM/4bxfD7wbqOjeb52oTTedNX5reKPEH/C0P+Csvx+16y/6HnTtB/8AAOHyZq9S8D/tIftN/sDmWL/hHPD37Qnh6GGaHTtUsJv7M8Q/9toZq8C/YJ/a30b9j7w6dZ8dfAj4z+K/ilqeozaxdkeV5Bu5qAPsD/g4Jt/7H+Ff7O1//wAtoPiVp1eg/sX/ANjfHH9l7W/BviSKC80SfztNu4pf+fS8r4j/AOCiH7e/jf8Abo/aH+EXg7xT8INU+FeieEvN8bQxapeQzXt7/wAsYa+sP+Ca+sS2/wDblrJ/y2hhmoA/nT/4KX/sV6x+wL+1v4n+G+o5EOmzedpUnae1l6H9a+dq/pP/AODjr/gnxD+1v+xzJ8RtCsWl8a/CuIZK9b3Ta/m359qAIK+qf+CRXxjb4LftseGmP/Hp4g8zSJvxGc18rVt+Edel8HeKNO1SPJk0u7hvYj7xS5FAH9H3/BfTxJ/wmf8Awb/ar66b4o0gZr+aav1A/wCCkf8AwXG8Ofte/wDBPvw/8FvBnhDU9Blm1KPVvE1/eENucdAMe5HPTFfl/QAV+9X/AAT3/wBH/Zs+Hv8A2A7Svwc59q/eP/gnt/ybb8PP+wHaUAfr3+wd/wAkrr3uvBf2B/8AklY+te9UAU/EHh+LxBY+VcxQzV4X8UPgvdeH55pbKLzrSvoCm3FvFqFv5UlAHxH8SfhvoPxQ8HahoPinRrLXvD2qQ+Td2F/D50E9fiB/wVd/4IJa7+zwmoePvhDFN4i8Bk/vtI5mvdE+vtX9H3xY+A8Vx/pWm/uZv+W0VeOaxo91o995UsXkzQ/uaAP4554MGnW91LYS+ZHJLDKO/ev3s/4Klf8ABBfw7+0omo+OvhNDB4X8ck5m0X/lz1k8cg9jxX4YfEj4Z6/8IvGN5oHiXR7/AELXNLl8i7sbuLyZoJPSgD9xv+CRP7cp/at/Z7hi1O5MvjLwl5Vnq2R/r4f+WM1fpR+y/wDGD/hD/EcMUsv+iXtfys/sM/tYap+xx8e9K8W2W5tPyIdVsu17a9xX9FHwf+KFh448OadrOkXXnaTqdpDeWl1/z3hmoA/UTT9Qi1C3ili/1M9T143+yv8AGD/hJ9D+wXMvnTQV7JQAUUUUAFYXji4+z6VW7XL+OLj7RfWlrQBw3xz+KVj8Bv2Z/HXjK9HlQ+GfD13qJ9hg/wBa/ly/4IFfCu4/av8A+C03wh+2SFXsvEUvjS+IGQWs0a8UfQuij8a/cD/g6I/aOP7P/wDwSj1rQ1TdcfEu5j0LjqFA3N+i5/Cvjr/gyn/ZnGp/Ef4xfF+53ldJs7bwnp2cbW8xhNK31AhiH/AjQB/QfRRRQB4T/wAFN/2Uz+23+wN8VPhjDHDJqPinw/cQ6YZThEvkXzLZiewEyJzX8lH/AASB/aI/4Z0/bX8Nz3khh0rXydJvfof8/rX9ptfx9f8ABw3+x1N+wj/wVR8dWOnqlr4f8XXK+NfD6ofljjuXYypjttnWZR7KtAH9Jv7D/jiK387S5a+nK/JL/gjf+2B/w0R8CPAfi3/mIf8AIN1f/rtDX6f/APC2LC3oA66iuS/4WhYUf8LQsKAOtorkv+Fs2HtR/wALZsPagDraK5L/AIWzYe1H/C2bD2oAh+JHwntfGFj5vleTL/yx8qvAfGHg+/8AC995VzFX0T/wtiw9KyfFPiDw54nsZYr2gD84/wDgoZ/wTL+HX/BQvwh5evRwaN4nh/5B3iO15mP1Hev58/24P2BvH/7AvxLk8OeOdLKgkHT9Ti/489Si9Qa/rW8QfCf9/NLpssOpWn/PLzvJngrxz9oD9m7wl+0R8OdR8G+P9Bg17w9qn+uil/18E3/PaGb/AJYzUAfzzfAj/goCdE/4JYfGT4Ba9dXDW2tT6fqPh4EdSt2Cw/XP418V1+jP/BQT/ggZ8Q/2b/E09/8AD2G5+IPgyblSMf2jZ+xH+fpXy7/w7d+OH/RNvEf/AHyP8aAPCK/d7/gnh/yb14C/7AcVfkx/w7d+OH/RNvEf/fI/xr9eP2F9HuvA/wAHfBGjavFPpuraXpENnNay/wCvgmoA/XL/AIJ//wDJOBXv9fOn7F+sReB/hXDLff8ALaavXv8AhaFhQB1tFcl/wtmw9qP+Fs2HtQB1tcl8SPhPF4ogml/5bUf8LZsPaj/hbNh7UAeAeMfA914XvvKuYv8AtrXy5/wUE/4Jt/Dv/goH4PNj4ntodM8Tw8af4ji/10I9K/RHxR4g0HxhBNFfRf66vLPE/wAL/wDXS6RdQ6lD/wA8vO8meCgD+Tj9u7/gnv8AET9gf4my+HvGViZdPLf8S/WIR/oWpj1Br7I/4N7/APgoZP8ACn4iw/DnVpWYOfO0AlcYfuK/Z348fs7+F/jx8Obvwb8RNBh17w9e/wCusJf+WE3/AD2h/wCeM1fir+1t/wAEOviL+xx8aNM8W/B+Z/FXhrTdQhvICP8Aj90w5HWgD9O/24Fk/ZH/AGmPDP7aPg7T5vEnhf8As6GD4iaVYf67H/LHUq8i/wCCV/h7xb4w+Kkvxa1f/kIfFu7u/Emo38v/ADxvPO8mGvfv2J/jx/wmOh3fhfUooZor20/c2v8Aywn86H99DXlusfs3/Eb9gfxHNr3wKig8bfD2eaabUfhpqk3/ACC5v+W02kzUAa3xo/Y28b/sj/FvVviD+z7FZTWmpzed4o+Gl/8A8eWqTf8ALaa0m/5YzV2/7N//AAVQ+FXjDVf7B8Qape/Cvxj/AMvfhzxlF9io+E//AAV4+CPjDydB8d3+p/DHXP8AoF+MtOmh8ib/AKYzVt/GDWP2Qfjh4c8rxl8UPhXqWnf88r/UYbygD3+38H/D74kfvftXh6aHyfO+1WGow1w/xP8Ajx+zB+whol54i8WeMfD95qGlwzTado/9o+fe3sv/ACyhhh/5bTTV+cPxg0f9gvw+TYfC74e+Lfjl4h/58PDnnaN4f/7bS15n8P8A9i/S9Y+KkXjfV/CXhLQdbhh8nTtB0GHydL0SH/2tNQB6D4G1fxR+0N8aPFnxZ8dRTw+LPiDN501h/wBAS0h/1Omxf9cYa/RT/gnf8L5bifVrr/ljBaV4j+zf+yPr3jCeKWKwmhh/5bX91+5gr9CPgvo/hz4H+FYdLsZYbyX/AJbS0AcncahF5EtrcxedDND5N3FL/qZ4a/m1/wCC5/8AwSpl/YP+Ok3iPwvZNL8LvFs0s2myAcaZLz/odf01+OPD9hrF9NdaTLD9rn/11rLXi/x4+E+jfFDwPq3hLxtoMGseHtai8m7tbqgD+PGiv0y/4KHf8G+Xi34G6rqGv/CETeN/B4ORYn/kJ2X1Hevzt8TeAde+H+oS2mtaNqWkTQ/62K6glh/nQBz9FFFAE/PtX7x/8E9v+Tbfh5/2A7Svwbtq/eT/AIJ7f8m5/D3/ALAUNAH6+fsD/wDJKx9a96r5v/Yf8U2ujfCSaWWXyfImr2P/AIWhYUAdbRXJf8LZsPaj/hbNh7UAdbXD/Ej4P2vjCCaX/Uy1b/4WhYUf8LQsKAPnrxh4HuvC995VzF/1xr5X/wCChn/BMvwB/wAFE/CE0evRwaN4xh/5B/iOL/XH6iv0W8UeINB8UQeVfV5n4g+E8Xn+bpN1DqVp/wA8v+W9AH8lP7bX7BPxC/YI+Jcnh3xzpZXP72w1KIZs9Si9Qa+2f+CDv7cmPN+DuvzFt377w8SMYPcV+yn7SH7M/g39pDwBd+DfiH4ch1jQ54f+WsPkzQf9NoZv+WM1fin+0R/wRQ+J/wCwj+0z4f8AF3wrlm8U+GrLUYZoL8D99pn/AF2oA/Zb4H/FiXw/rtpdRy/8tv31foF4X1iLxDpVpdR/8t4a/H74L+OJfEM8MVt/rZ/3MMUVfp/8H/GEXg/wBp1rey/6X5MPnRUAen0VyX/C2bD2o/4WzYe1AHV3Ncpo/wDxOPFU0v8AzxouPihYahBNaxywebN/qa4v9oP9oLQP2Lv2WfG3xO1+UQ2vhPTprzGcGeX/AJZRf9tpiPzoA/AD/g7q/bNHxt/bc0X4aWM7Sab8L9PxJtHLX83X8gBX7I/8G4n7Iv8AwyL/AMEoPh5bXURi13x1G3jDVstuPm3gUxj8IFhGPXNfzl/8E7v2f9a/4LK/8FbdFsPES3M8PjHXbjxL4qnTgwWEf7x+exIAQH1da/sasLCHS7GG1tokgt7aNYoo0GFjRRgKB2AAAoAlooooAK/JT/g7t/YHf9o79hXT/i1osAk8RfBid7q55wZdKuNqXC+5V1if6Bq/Wusjx/4E0j4o+BNa8M6/YwapoXiKwn0zUbOYZju7aaNo5YmHdWRmB9jQB/KZ/wAG2v7c2nfs4ftmR+CfFVwE8L/ERvLUkFYtOv8Ana2PoMflX9F1xf6Nbz+VJqmi/wDgXDX8oP8AwVg/4J/61/wTJ/ba8X/DO+aSXTbZhfeH758btV0ucsIZTjjcpVkYdmRu2K+dv+Ex1n/oNan/AOBUtAH9oX9taL/0E9F/8C4aP7a0X/oJ6L/4Fw1/F7/wmOsf9BXVP/AqWj/hMdY/6Cuqf+BUtAH9oX9taL/0E9F/8C4aP7Z0b/oKaX/4FxV/F7/wmOsf9BXVP/AqWj/hMdY/6Cuqf+BUtAH9oX9s6N/0FNL/APAuKpf7X0b/AKCmi/8AgXDX8XH/AAmOsf8AQV1T/wACpaP+Ex1j/oK6p/4FS0Af2hf2zo3/AEFNL/8AAuKj+2tF/wCgnov/AIFw1/F7/wAJjrH/AEFdU/8AAqWj/hMdY/6Cuqf+BUtAH9of9saN/wBBnS//AAYw1J/bGl3EHlXOs6LeQ/8ATW7hr+Lj/hMdY/6Cuqf+BUtH/CY6x/0FdU/8CpaAP7G/GHwv8EeOIf8ASb+Cz87/AJ9dRhrnv+GX/hz/ANB+b/wbw1/IL/wmOsf9BXVP/AqWj/hMdY/6Cuqf+BUtAH9fX/DL/wAOf+g7N/4MYaPC/wCyf8KvC/ir+2Y5YJrv/prdw1/IL/wmOsf9BXVP/AqWj/hMdY/6Cuqf+BUtAH9oX9taL/0E9F/8C4aP7a0X/oJ6L/4Fw1/F7/wmOsf9BXVP/AqWj/hMdY/6Cuqf+BUtAH9o/wDa+jf9BTRf/AuGov7Z0b/oKaX/AOBcVfxe/wDCY6x/0FdU/wDAqWj/AITHWP8AoK6p/wCBUtAH9oX9taL/ANBPRf8AwLho/trRf+gnov8A4Fw1/F7/AMJjrH/QV1T/AMCpaP8AhMdY/wCgrqn/AIFS0Af2kf2zo3/QZ0z/AMC4aT+2NF/6Cmmf+BkNfxcf8JjrH/QV1T/wKlo/4THWP+grqn/gVLQB/aONY0u4g8q51nRbyL/prdwzVyfjD4T+A/HEE0V7dWUPn/8APrqMNfxyf8JjrH/QV1T/AMCpaP8AhMdY/wCgrqn/AIFS0Af2K/C/4L/Dn4Pz+b4fl0WGab/XXUs0M01bniDw/wCDfEH+sl0WH/r1u4a/jO/4THWP+grqn/gVLR/wmOsf9BXVP/AqWgD+un4kfsj/AA++KEPlalrPh7Uv+mWqQ2l7/wCjq8t/4dLfBX1+HH/guhr+Wj/hMdY/6Cuqf+BUtH/CY6x/0FdU/wDAqWgD+sPw9/wT/wDhzo0EUUviiD+z/wDn1sJrSGCvR/A/7P8A8NPhv/x4xeH5v+mt1LDNX8ev/CY6x/0FdU/8CpaP+Ex1j/oK6p/4FS0Af2j/ANsaXcQeV/bOi+VB/wAsvOh8iov7a0X/AKCei/8AgXDX8Xv/AAmOsf8AQV1T/wACpaP+Ex1j/oK6p/4FS0Af2kf2zo3/AEGdM/8AAuGkGsaXcQeVLrOizQ/9NbuGav4uP+Ex1j/oK6p/4FS0f8JjrH/QV1T/AMCpaAP7LPEHgfwbrB82W60uzl/562t3DDXmPxQ/Yv8Ahz8UP+P7WfD03/X/AA2k1fyQ/wDCY6x/0FdU/wDAqWj/AITHWP8AoK6p/wCBUtAH9Vv/AA7H+E3/AD9eC/8AwXQ1N/w7G+E3/PbwX/4Loa/lM/4TXWf+g1qf/gXLR/wmus/9BrU//AuWgD+rO3/4JjfCX/n68F/+C6GtDwv/AME//h94X1yGX/hLYJov+fCKaGGCv5PP+Ex1n/oNan/4FS0f8JjrH/QV1T/wKloA/s30e30HR9KitbK/0WG0g/1MXnQ1b/trRf8AoJ6L/wCBcNfxe/8ACY6x/wBBXVP/AAKlo/4THWP+grqn/gVLQB/aF/bWi/8AQT0X/wAC4aP7a0X/AKCei/8AgXDX8Xv/AAmOsf8AQV1T/wACpaP+Ex1j/oK6p/4FS0Af2hf21ov/AEE9F/8AAuGj+2tF/wCgnov/AIFw1/F7/wAJjrH/AEFdU/8AAqWj/hMdY/6Cuqf+BUtAH9oX9taL/wBBPRf/AALho/tjRv8Alnqmi/8AgXDX8Xv/AAmOsf8AQV1T/wACpaP+Ex1j/oK6p/4FS0Af2j/2xpdxB5Vzqmi3kP8Azylu4a47xz8F/h98QPNivrqyhhn/ANd5Wow1/HT/AMJjrH/QV1T/AMCpaP8AhMdY/wCgrqn/AIFS0Af2K/Df4L/Dn4T/AL3RP+Eehl/5+pZoZp663+2tF/6Cei/+BcNfxe/8JjrH/QV1T/wKlo/4THWP+grqn/gVLQB/aF/bWi/9BPRf/AuGj+2dG/6Cml/+BcVfxe/8JjrH/QV1T/wKlo/4THWP+grqn/gVLQB/aP8A2xo3/LLVNL/8C4a/G7/g68/4Kaw+N7bw5+z34VvX2aV/xMPEzBchnwdq5/M/n61+JP8AwmOs/wDQa1P/AMCpa+sv+CMv/BNbV/8Agqn+3Fovg26a7i8MWMZ1nxdqEbhXg04FQFTP8buVReDgvkjANAH7Zf8ABo3/AME2F/Z0/ZQv/jn4hs1j8U/FxANHJfc1roalWiHsZZFLn/ZSOv1/rP8ACnhXTfAvhfTtE0axttM0jSLaOysrS3QJDawxqESNFHAVVAAHoK0KACiiigAooooA/N3/AIOSf+CRD/8ABSf9lBPEfg+wil+LPw4R7rRzu2tqdoeZ7Mnpkgb0z/EuP4jX8mVt5UF7F5n+r/5a1/ffX85n/B0z/wAEP3+DHiTUf2kPhXo8Q8H6yc+NtMhCqukXLMqpexrx+7kJwwH3X56NwAeG/so/8EEfDn7aXwZ0vx/4B8a+JNQ0W8+VlMaifS5vQjHrXo3/ABCu3H/Qc8T/APflP8K/PD9g/wD4Kc/Fz/gnV4h1S++F/iGHTI9Zi8m7tr2Hz4G/CvpD/iKP/a1/6GDwf/4IF/xoA9+/4hYr3/oOeKf+/S/4Uv8AxCu3H/Qc8T/9+U/wrwD/AIij/wBrX/oYPB//AIIF/wAaP+Io/wDa1/6GDwf/AOCBf8aAPf8A/iFduP8AoOeJ/wDvyn+FH/EK7cf9BzxP/wB+U/wrwD/iKP8A2tf+hg8H/wDggX/Gj/iKP/a1/wChg8H/APggX/GgD3//AIhXbj/oOeJ/+/Kf4Uf8Qrtx/wBBzxP/AN+U/wAK8A/4ij/2tf8AoYPB/wD4IF/xo/4ij/2tf+hg8H/+CBf8aAPf/wDiFduP+g54n/78p/hR/wAQrtx/0HPE/wD35T/CvAP+Io/9rX/oYPB//ggX/Gj/AIij/wBrX/oYPB//AIIF/wAaAPf/APiFduP+g54n/wC/Kf4Uf8Qrtx/0HPE//flP8K8A/wCIo/8Aa1/6GDwf/wCCBf8AGj/iKP8A2tf+hg8H/wDggX/GgD3/AP4hXbj/AKDnif8A78p/hR/xCu3H/Qc8T/8AflP8K8A/4ij/ANrX/oYPB/8A4IF/xo/4ij/2tf8AoYPB/wD4IF/xoA9//wCIV24/6Dnif/vyn+FJ/wAQsV7/ANBzxT/36X/CvAf+Io/9rX/oYPB//ggX/Gj/AIij/wBrX/oYPB//AIIF/wAaAPf/APiFduP+g54n/wC/Kf4Uf8Qrtx/0HPE//flP8K8A/wCIo/8Aa1/6GDwf/wCCBf8AGj/iKP8A2tf+hg8H/wDggX/GgD37/iFivf8AoOeKf+/S/wCFL/xCu3H/AEHPE/8A35T/AArwD/iKP/a1/wChg8H/APggX/Gj/iKP/a1/6GDwf/4IF/xoA9//AOIV24/6Dnif/vyn+FJ/xCxXv/Qc8U/9+l/wrwH/AIij/wBrX/oYPB//AIIF/wAaP+Io/wDa1/6GDwf/AOCBf8aAPf8A/iFkuP8AoOeKP+/S/wCFH/EK7cf9BzxP/wB+U/wrwD/iKP8A2tf+hg8H/wDggX/Gj/iKP/a1/wChg8H/APggX/GgD3//AIhXbj/oOeJ/+/Kf4Uf8Qrtx/wBBzxP/AN+U/wAK8A/4ij/2tf8AoYPB/wD4IF/xo/4ij/2tf+hg8H/+CBf8aAPfv+IWK9/6Dnin/v0v+FL/AMQrtx/0HPE//flP8K8A/wCIo/8Aa1/6GDwf/wCCBf8AGj/iKP8A2tf+hg8H/wDggX/GgD3/AP4hXbj/AKDnif8A78p/hR/xCu3H/Qc8T/8AflP8K8A/4ij/ANrX/oYPB/8A4IF/xo/4ij/2tf8AoYPB/wD4IF/xoA9+/wCIWK9/6Dnin/v0v+FL/wAQrtx/0HPE/wD35T/CvAP+Io/9rX/oYPB//ggX/Gj/AIij/wBrX/oYPB//AIIF/wAaAPf/APiFduP+g54n/wC/Kf4Un/ELFe/9BzxT/wB+l/wrwH/iKP8A2tf+hg8H/wDggX/Gj/iKP/a1/wChg8H/APggX/GgD37/AIhYr3/oOeKf+/S/4Uv/ABCyXH/Qc8Uf9+l/wrwD/iKP/a1/6GDwf/4IF/xo/wCIo/8Aa1/6GDwf/wCCBf8AGgD3/wD4hXbj/oOeJ/8Avyn+FH/EK7cf9BzxP/35T/CvAP8AiKP/AGtf+hg8H/8AggX/ABo/4ij/ANrX/oYPB/8A4IF/xoA9/wD+IV24/wCg54n/AO/Kf4Uf8Qrtx/0HPE//AH5T/CvAP+Io/wDa1/6GDwf/AOCBf8aP+Io/9rX/AKGDwf8A+CBf8aAPfv8AiFivf+g54p/79L/hS/8AEK7cf9BzxP8A9+U/wrwD/iKP/a1/6GDwf/4IF/xo/wCIo/8Aa1/6GDwf/wCCBf8AGgD3/wD4hXbj/oOeJ/8Avyn+FH/EK7cf9BzxP/35T/CvAP8AiKP/AGtf+hg8H/8AggX/ABo/4ij/ANrX/oYPB/8A4IF/xoA9/wD+IV24/wCg54n/AO/Kf4Uf8Qslx/0HPFH/AH6X/CvAP+Io/wDa1/6GDwf/AOCBf8aP+Io/9rX/AKGDwf8A+CBf8aAPf/8AiFduP+g54n/78p/hR/xCu3H/AEHPE/8A35T/AArwD/iKP/a1/wChg8H/APggX/Gj/iKP/a1/6GDwf/4IF/xoA9//AOIV24/6Dnif/vyn+FH/ABCu3H/Qc8T/APflP8K8A/4ij/2tf+hg8H/+CBf8aP8AiKP/AGtf+hg8H/8AggX/ABoA9/8A+IV24/6Dnif/AL8p/hSf8QsV7/0HPFP/AH6X/CvAf+Io/wDa1/6GDwf/AOCBf8aP+Io/9rX/AKGDwf8A+CBf8aAPf/8AiFduP+g54n/78p/hXOfF3/g3A0j4CfDLXPG/jHxtrug+GfD8PnXl0Y1P8xXkf/EUf+1r/wBDB4P/APBAv+NeLftyf8Fhvjn/AMFDfCmleHPiD4ihudD02XzobHTodgz6nB/rQB4VoHwouvjF8cbTwf8ADzTdT1u88Q6oun6BZdLi5achYV+pJFf1+/8ABFb/AIJZaT/wSp/ZBsvCbNaX/jnX2XUvFuqw5K3t5ggIpbny41O1fX5j/FXyT/wbZf8ABCOP9jbwZZfHD4saMg+LfiC336Lplwp3eDrORWBTGSBPIrfN3RTt6lq/XWgAooooAKKKKACiiigAqn4h8PWHi7Qb3StUsrXUdN1GB7a6tbmISw3MTqVZHU5DKQSCDwQauUUAfy7/APBfj/g3h1j/AIJ/6xq3xW+FVpJrXwRuSrXdnvL3vg1iVHVjmSEt91+ozhh0avyLr+/TV9ItfEGlXNjfW0F5ZXkTQTwTIHjmjYYZWU8EEEgg1+C//BaH/g1Hd5NS+I/7LOnoInP2jVPh0ZdkUhGMtpzNwp6nynP+6R90gH4i/s9fss+Lf2oNek0rwfHpl7qn8NjJdxQzTD2zXrX/AA5n+Pv/AEKUH/gxir591zSdd+DnjKezuYdY8N+ItIuCslvcwzWN/YTA8gqcFT9ea+4f2Nf+C6viz4WNFovxQsZvHnh8HH24ERanB+I60AeN/wDDmr4+f9CjB/4MYv8AGj/hzV8fP+hRg/8ABjF/jX7Zfsw/tXfs8/tfW8J8HfF7w/pmtnpo/iP/AIll6a+ibf8AYv1nWIIZbGXRdShm/wCWthd+dBQB/OJ/w5q+Pn/Qowf+DGL/ABqX/hzP8ff+hSg/8GMVf0V/8Mca/wD8+sH/AIF0f8Mba/8A9A+D/wAC6AP51P8AhzP8ff8AoUoP/BjFR/w5n+Pv/QpQf+DGKv6K/wDhjbX/APoHwf8AgXR/wxtr/wD0D4P/AALoA/nP/wCHNXx8/wChRg/8GMX+NH/Dmr4+f9CjB/4MYv8AGv6MP+GNtf8A+gfB/wCBdH/DG2v/APQPg/8AAugD+dT/AIcz/H3/AKFKD/wYxVF/w5q+Pn/Qowf+DGL/ABr+jD/hjbX/APoHwf8AgXR/wxtr/wD0D4P/AALoA/nP/wCHNXx8/wChRg/8GMX+NS/8OZ/j7/0KUH/gxir+iv8A4Y21/wD6B8H/AIF0f8Mba/8A9A+D/wAC6AP5z/8AhzV8fP8AoUYP/BjF/jUv/Dmf4+/9ClB/4MYq/or/AOGNtf8A+gfB/wCBdH/DG2v/APQPg/8AAugD+dT/AIcz/H3/AKFKD/wYxVF/w5q+Pn/Qowf+DGL/ABr+jD/hjbX/APoHwf8AgXR/wxtr/wD0D4P/AALoA/nP/wCHNXx8/wChRg/8GMX+NS/8OZ/j7/0KUH/gxir+iv8A4Y21/wD6B8H/AIF0f8Mba/8A9A+D/wAC6AP51P8AhzP8ff8AoUoP/BjFR/w5n+Pv/QpQf+DGKv6K/wDhjbX/APoHwf8AgXR/wxtr/wD0D4P/AALoA/nU/wCHM/x9/wChSg/8GMVH/Dmf4+/9ClB/4MYq/or/AOGNtf8A+gfB/wCBdH/DG2v/APQPg/8AAugD+dT/AIcz/H3/AKFKD/wYxUf8OZ/j7/0KUH/gxir+iv8A4Y21/wD6B8H/AIF0f8Mba/8A9A+D/wAC6AP51P8AhzP8ff8AoUoP/BjFUX/Dmr4+f9CjB/4MYv8AGv6MP+GNtf8A+gfB/wCBdH/DG2v/APQPg/8AAugD+dT/AIcz/H3/AKFKD/wYxUf8OZ/j7/0KUH/gxir+iv8A4Y21/wD6B8H/AIF0f8Mba/8A9A+D/wAC6AP5z/8AhzV8fP8AoUYP/BjF/jUv/Dmf4+/9ClB/4MYq/or/AOGNtf8A+gfB/wCBdH/DG2v/APQPg/8AAugD+dT/AIcz/H3/AKFKD/wYxUf8OZ/j7/0KUH/gxir+iv8A4Y21/wD6B8H/AIF0f8Mba/8A9A+D/wAC6AP5z/8AhzV8fP8AoUYP/BjF/jR/w5q+Pn/Qowf+DGL/ABr+jD/hjbX/APoHwf8AgXR/wxtr/wD0D4P/AALoA/nP/wCHNXx8/wChRg/8GMX+NS/8OZ/j7/0KUH/gxir+iv8A4Y21/wD6B8H/AIF0f8Mba/8A9A+D/wAC6AP5z/8AhzV8fP8AoUYP/BjF/jUv/Dmf4+/9ClB/4MYq/or/AOGNtf8A+gfB/wCBdH/DG2v/APQPg/8AAugD+c//AIc1fHz/AKFGD/wYxf40f8Oavj5/0KMH/gxi/wAa/ow/4Y21/wD6B8H/AIF0f8Mba/8A9A+D/wAC6AP5z/8AhzV8fP8AoUYP/BjF/jR/w5q+Pn/Qowf+DGL/ABr+jD/hjbX/APoHwf8AgXR/wxtr/wD0D4P/AALoA/nP/wCHNXx8/wChRg/8GMX+NH/Dmr4+f9CjB/4MYv8AGv6MP+GNtf8A+gfB/wCBdS2/7G/iP/n1g/8AAugD+c//AIcz/H3/AKFKD/wYxUf8OZ/j7/0KUH/gxir+kC3/AGF9euIPNuf7Lh/6ayzeTBXjv7R3xG+BH7IOmSyfEf42+ErSY9NP0r/iZ3poA/CH/hzP8ff+hSg/8GMVedftD/sQePP2WrSGTxrDpemzXH+qtf7QimnP4CvuH9sv/gvpDd+doPwL0KfR9P7eIdYGb9q+F/hb8I/ix/wUD+OEWkeFtL8TfEbx3rALkL++mwOrMx4VQOSSQBQB5LBBk1/Rb/wbl/8ABunJ8K5tL+PHx90Jf+EhZfP8K+Er+PeNHU8rc3CnI83B+RCPl6nnGPb/APgiR/wbSeFf2CJtN+JXxbex8afF5UL21rHiTSPDJJOBACP3soB++RtXOFHG4/q1QAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB8s/wDBQ7/gjj8Cf+CmOj5+IXhcW3iWFVS18T6MVs9ZtQp4UTbSHXk/K4Ye1fiB+2p/wZ4fG74P3El98I9e0H4vaIMMbS7ZdI1lTk5A3kxOAMc+YD1+Wv6ZaKAP4Ufjt+yB8Uf2W9UjtfiP8O/GPgWSfJjXWtJntFkA64LAZ/Ct/wCC/wC3x8ZvgBJGfB/xK8X6Quf9UNRlkh/Lmv7D/wDgpb/ybDef9faf+i5K/k0/bm/5KL4n/wCwjNQB6X4L/wCDk79qzwW/PjHTL9f+njRoSf5Cu1/4ipv2mfXwZ/4LP/r1+Z1FAH6Y/wDEVN+0z6+DP/BZ/wDXo/4ipv2mfXwZ/wCCz/69fmdRQB+mP/EVN+0z6+DP/BZ/9ej/AIipv2mfXwZ/4LP/AK9fmdRQB+mP/EVN+0z6+DP/AAWf/Xo/4ipv2mfXwZ/4LP8A69fmdRQB+mP/ABFTftM+vgz/AMFn/wBej/iKm/aZ9fBn/gs/+vX5nUUAfpj/AMRU37TPr4M/8Fn/ANej/iKm/aZ9fBn/AILP/r1+Z1FAH6Y/8RU37TPr4M/8Fn/16P8AiKm/aZ9fBn/gs/8Ar1+Z1FAH6Y/8RU37TPr4M/8ABZ/9ej/iKm/aZ9fBn/gs/wDr1+Z1FAH6Y/8AEVN+0z6+DP8AwWf/AF6P+Iqb9pn18Gf+Cz/69fmdRQB+mP8AxFTftM+vgz/wWf8A16P+Iqb9pn18Gf8Ags/+vX5nUUAfpj/xFTftM+vgz/wWf/Xo/wCIqb9pn18Gf+Cz/wCvX5nUUAfpj/xFTftM+vgz/wAFn/16P+Iqb9pn18Gf+Cz/AOvX5nUUAfpj/wARU37TPr4M/wDBZ/8AXo/4ipv2mfXwZ/4LP/r1+Z1FAH6Y/wDEVN+0z6+DP/BZ/wDXo/4ipv2mfXwZ/wCCz/69fmdRQB+mP/EVN+0z6+DP/BZ/9ej/AIipv2mfXwZ/4LP/AK9fmdRQB+mP/EVN+0z6+DP/AAWf/Xo/4ipv2mfXwZ/4LP8A69fmdRQB+mP/ABFTftM+vgz/AMFn/wBej/iKm/aZ9fBn/gs/+vX5nUUAfpj/AMRU37TPr4M/8Fn/ANej/iKm/aZ9fBn/AILP/r1+Z1FAH6Y/8RU37TPr4M/8Fn/16P8AiKm/aZ9fBn/gs/8Ar1+Z1FAH6Y/8RU37TPr4M/8ABZ/9ej/iKm/aZ9fBn/gs/wDr1+Z1FAH6Y/8AEVN+0z6+DP8AwWf/AF65rxh/wcy/tW+JW+TxJomlDv5GiRD+Yr886t2H+vioA99+NP8AwVG+Pn7Qz/8AFUfFXxbcqekUeoyww/kDTf2Zf+Cbfx+/bbuoZPh18MPGPiq1vHKHVxpssdghAz8102Ix+LV9Xf8ABHb/AJLTp3/XGv6qfhT/AMku8Nf9gq1/9ErQB+CP7E3/AAZj67rxXUv2gfiFBo9sxz/wj/hEiRun8dxIoRef7qN9a/bL9j/9hT4T/sGfDlfC3wp8F6T4T0w8zvAhe6vWyTumnfMkp5ONzHHQYFet0UAFFFFABRRRQAUUUUAFFFFAH//Z';
            console.log(team);
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
            doc.text(195, 53, 'Asociacion Departamental');
            doc.text(195, 78, 'de Voleibol Cochabamba');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 110, 'Formulario:02');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 130, 'Nombre Club:' +" "+ club);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 160, 'Categoria:' +" "+ category);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(350, 160, 'Division:' +" "+ division);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(70, 190, 'Rama:' +" "+ branch);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(230, 190, 'Campeonato:' +" "+ nameChampionship);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(450, 190, 'Gestion:' +" "+ todayYear);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(270, 225, 'RELACION');
            doc.text(220, 255, 'NOMINAL DE JUGADORES');

            //doc.setFontType("bold");
            doc.setFontSize(10); //aumenta tamanio de la letra
            doc.cellInitialize();
            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre Completo"){
                        doc.cell(70,285,120,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Fecha de Nacimiento"){
                        doc.cell(70,285,123,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Club Origen"){
                        doc.cell(70,285,90,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Registro"){
                        doc.cell(70,285,100,29,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else{
                        doc.cell(70,285,27,29,cell,i);
                        doc.setFillColor(221,221,221);
                    }

                });

            });
            doc.save('Reporte Equipos Mayores.pdf');
            //doc.output("dataurlnewwindow");
        }

        $scope.tableToJason2 = function(team, $index){
            var data = [];
            var headers = [];

            data.push({Nro:'Nro', 'Nombre Completo':'Apellidos y Nombres', 'Fecha de Nac.':'Fecha de Nac.','O.R.C':'O.R.C','Libro Nro':'Libro Nro','Partida':'Partida',
                'F. de Partida':'F. de Partida', 'Club Origen':'Club Origen', 'Registro':'Registro Asociacion'});
            for(var i = 0; i < $scope.Teams.length; i++){
                var tableRow = $scope.Teams[i];
                var rowData = {};
                rowData['Nro'] = '1';
                rowData['Nombre Completo'] = tableRow.name;
                rowData['Fecha de Nac.'] = tableRow.nameChampionship;
                //rowData['Certificado de Nacimiento'] = '';
                rowData['O.R.C'] = tableRow.nameChampionship;
                rowData['Libro Nro'] = tableRow.nameChampionship;
                rowData['Partida'] = tableRow.nameChampionship;
                rowData['F. de Partida'] = tableRow.nameChampionship;
                rowData['Club Origen'] = tableRow.branch;
                rowData['Registro'] = tableRow.branch;

                data.push(rowData);
            }
            //console.log("-----------------------");
            //console.log(data);
            return data;
        };
        $scope.generateReport2 = function(team, $index){
            var table = $scope.tableToJason2(team, $index);
            var imgData = 'data:image/jpeg;base64,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';
            console.log(team);
            var club = team.club;
            var teams = team.name;
            var category = team.category;
            var division = team.division;
            var branch = team.branch;
            var nameChampionship = team.nameChampionship;
            var today = new Date();
            var todayYear = today.getFullYear();

            var doc = new jsPDF({},'pt','letter',true);
            doc.addImage(imgData, 'JPEG', 50, 10, 70, 70);

            doc.setFont("helvetica");
            doc.setFontSize(22); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(195, 53, 'Asociacion Departamental');
            doc.text(195, 78, 'de Voleibol Cochabamba');

            doc.setFont("helvetica");
            doc.setFontSize(18); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(250, 110, 'Formulario:02');

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(50, 130, 'Nombre Club:' +" "+ club);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(50, 160, 'Categoria:' +" "+ category);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(350, 160, 'Division:' +" "+ division);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(50, 190, 'Rama:' +" "+ branch);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(230, 190, 'Campeonato:' +" "+ nameChampionship);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(450, 190, 'Gestion:' +" "+ today);

            doc.setFont("helvetica");
            doc.setFontSize(16); //aumenta tamanio de la letra
            doc.setFontType("bold");
            doc.text(270, 225, 'RELACION');
            doc.text(220, 255, 'NOMINAL DE JUGADORES');

            //doc.setFontType("bold");
            doc.setFontSize(8); //aumenta tamanio de la letra
            //doc.setDrawColor(255,0,0);
            doc.rect(272, 270, 200, 15);
            doc.text(342, 280, 'Certificado de Nacimiento');
            doc.cellInitialize();

            $.each(table, function(i,row){
                $.each(row,function(j,cell){
                    if(j=="Nombre Completo"){
                        doc.cell(50,285,120,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Fecha de Nac."){
                        doc.cell(50,285,75,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Club Origen"){
                        doc.cell(50,285,90,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Registro"){
                        doc.cell(50,285,100,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Certificado de Nacimiento"){
                        doc.cell(50,285,200,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    //doc.setTextColor(255, 24, 13);
                    //doc.setFontType("italic");
                    }else if(j=="O.R.C"){
                        doc.cell(50,285,50,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Libro Nro"){
                        doc.cell(50,285,50,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                        //doc.setTextColor(255, 24, 13);
                        //doc.setFontType("italic");
                    }else if(j=="Partida"){
                        doc.cell(50,285,50,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    //doc.setTextColor(255, 24, 13);
                    //doc.setFontType("italic");
                    }else if(j=="F. de Partida"){
                        doc.cell(50,285,50,20,cell,i);
                        doc.setFont("helvetica");
                        doc.setFillColor(250,0,0);

                    //doc.setTextColor(255, 24, 13);
                    //doc.setFontType("italic");
                    }else{
                        doc.cell(50,285,22,20,cell,i);
                        doc.setFillColor(221,221,221);
                    }
                });

            });
            doc.save('Reporte Equipos Menores.pdf');
            //doc.output("dataurlnewwindow");
        }
    }
]);
