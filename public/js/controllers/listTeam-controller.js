advcApp.controller('listTeamsCtrl', ['$scope', '$routeParams',
    '$location', 'listTeamSrv', 'listChampionshipSrv',
    function($scope, $routeParams, $location, listTeamSrv,
             listChampionshipSrv) {
        var currentClubId = $routeParams.clubId;
        $scope.currentClubName = $routeParams.clubName;

        $scope.Teams = [];
        $scope.newTeam = {};
        $scope.Championships = [];
        $scope.createMode = false;
        $scope.editMode = false;

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
                club: currentClubId,
                color: {
                    code: $scope.newTeam.color.code,
                    rgbHex: $scope.newTeam.color.rgbHex
                }
            };
            console.log(newTeam);
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
                        $scope.Teams[teamIndex]= team;
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

        $scope.formDeleteTeam = function(teamId, index){
            var r = confirm("¿Quiere confirmar la eliminación del equipo?");
            if (r === true) {
                listTeamSrv.delete({teamId: teamId}, function(data){
                        $scope.Teams.splice(index,1);
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
        };

        $scope.formEditTeam = function(team, index){
            $scope.createMode = false;
            $scope.editMode = true;
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
            if (!team.players) {
                team.players = [];
            }
            if (!team.color) {
                team.color = {code: 'color1'}
            }
        };
    }
]);
