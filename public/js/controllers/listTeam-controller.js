advcApp.controller('listTeamsCtrl', ['$scope', '$routeParams',
    '$location', 'listTeamSrv',
    function($scope, $routeParams, $location, listTeamSrv) {
        $scope.Teams = [];
        $scope.newTeam = {};
        $scope.createMode = false;
        $scope.editMode = false;
        $scope.showModal = false;

        var restartValidationFields = function(){
            $scope.isNameValid = true;
        };

        restartValidationFields();

        $scope.createTeam= function () {
            var newTeam = {
                name: $scope.newTeam.name,
                division: $scope.newTeam.division,
                branch: $scope.newTeam.branch,
                category: $scope.newTeam.category
            };

            if($scope.validateFields()){
                if(pass === confirmPass){
                    var newTeam = {
                        team: $scope.newTeam
                    };
                    listTeamSrv.save({team: newTeam},
                        function (data) {
                            $scope.Teams.push(data);
                            $('#create-team').modal('hide'); //hide modal
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $scope.newTeam = {};
                        },
                        function(error){
                            console.log(error);
                        }
                    );
                }
                else{
                    alert("Las contraseñas no coinciden.");
                }
            }
        };

        $scope.validateFields = function () {
            var name = $scope.newTeam.name;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;

            if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            }
            return true;
        };

        listTeamSrv.query({},
            function(result){
                $scope.Teams = [result.data];
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

        $scope.deleteTeam = function(teamId, index){
            var currentTeam = SessionService.get("teamId");
            if(teamId !== currentTeam){
                var r = confirm("¿Quiere confirmar la eliminacion del equipo?");
                if (r === true) {
                    listTeamSrv.delete({team_id: teamId}, function(data){
                            $scope.Teams.splice(index,1);
                        },
                        function(error){
                            console.log(error);
                        }
                    );
                }
            } else{
                alert('No se puede borrar al equipo');
            }

        }
    }
]);
