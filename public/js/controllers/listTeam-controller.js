advcApp.controller('listTeamsCtrl', ['$scope', '$routeParams',
    '$location', 'listTeamSrv','listChampionshipSrv',
    function($scope, $routeParams, $location, listTeamSrv,listChampionshipSrv) {
        var currentClubId = $routeParams.clubId;
        $scope.currentClubName = $routeParams.clubName;

        $scope.Teams = [];
        $scope.newTeam = {};
        $scope.Championships = {};
        $scope.createMode = false;
        $scope.editMode = false;
        $scope.showModal = false;

        listChampionshipSrv.get({},
            function(result){
                //console.log(result);
                for(var index in result.data){
                    var championship = result.data[index];
                    var fullName = championship.name;
                    result.data[index].fullName = fullName;
                }
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
            'Primera Honor',
            'Primera Ascenso',
            'Segunda Ascenso',
            'Tercera Ascenso',
            'Maxi Voleibol'
        ];

         $scope.minorCategoryValues = [
            'Pre Mini',
            'Mini',
            'Infantil',
            'Cadete',
            'Juvenil',
            'Sub-23'
        ];

        //$scope.newTeam.category =  $scope.categoryValues[0];
        var restartValidationFields = function(){
            $scope.isNameValid = true;
        };

        restartValidationFields();

        $scope.createTeam = function () {
            var newTeam = {
                name: $scope.newTeam.name,
                championship: $scope.newTeam.championship,
                division: $scope.newTeam.division,
                branch: $scope.newTeam.branch,
                category: $scope.newTeam.category,
                club: currentClubId
            };
            if($scope.validateFields()){
                listTeamSrv.save({team: newTeam},
                    function (teams) {
                        var team = teams.data;
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
                division: $scope.newTeam.division,
                branch: $scope.newTeam.branch,
                category: $scope.newTeam.category
            };
            if($scope.validateFields()){
                listTeamSrv.update({teamId: teamId}, {newDataTeam: newTeam},
                    function (teams) {
                        var team = teams.data;
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

        $scope.validateFields = function () {
            var name = $scope.newTeam.name;
            var championship = $scope.newTeam.championship;
            var branch = $scope.newTeam.name;
            var category = $scope.newTeam.name;
            var division = $scope.newTeam.name;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;

            if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            }else if (!name) {
                $scope.isNameValid = false;
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('El nombre para el equipo es inválido. Por favor ' +
                    'ingrese un nombre válido.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!championship) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese un campeonato para inscribir al equipo.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!branch) {
            $.noty.consumeAlert({layout: 'topCenter',
                type: 'warning', dismissQueue: true ,
                timeout:2000 });
            alert('Ingrese la rama en la cual participara el equipo.');
            $.noty.stopConsumeAlert();
            return false;
            } else if(!category) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese la categoria en la cual participara el equipo.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!division) {
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
                console.log(result);
                $scope.Teams = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        $scope.formCreateTeam = function () {
            $scope.createMode = true;
            $scope.editMode = false;
        };

        $scope.closeModal=function(){
            $scope.showModal = !$scope.showModal;
            $scope.newTeam = {};
            restartValidationFields();
        };

        $scope.formDeleteTeam = function(teamId, index){
            var r = confirm("¿Quiere confirmar la eliminacion del equipo?");
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
                division: team.division,
                branch: team.branch,
                category: team.category,
                id: team.id,
                index: index
            };
        }
    }
]);
