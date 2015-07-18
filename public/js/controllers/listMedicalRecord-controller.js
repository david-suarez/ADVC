advcApp.controller('listMedicalRecordCtrl', ['$scope', '$routeParams',
    '$location','listMedicalRecordSrv','listPlayersSrv',
    function($scope, $routeParams, $location, listMedicalRecordSrv,
             listPlayersSrv) {
        $scope.Medicals = {};
        $scope.newMedicalRecord = {};
        $scope.Players = {};

        $scope.formCreateMedical = function () {
            $scope.newMedicalRecord = {};
            $scope.createMode = true;
            $scope.editMode = false;
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
                console.log("aqui"+ error);
            }
        );

        listMedicalRecordSrv.get({},
            function(result){
                $scope.Medicals = result.data;
            },
            function(error){

                console.log("aca"+ error);
            }
        );

        $scope.createMedicalRecord= function () {
            var newMedical = {
                player: $scope.newMedicalRecord.player ?
                    $scope.newMedicalRecord.player._id : null,
                age: $scope.newMedicalRecord.age,
                weight: $scope.newMedicalRecord.weight,
                height: $scope.newMedicalRecord.height,
                home: $scope.newMedicalRecord.home,
                allergies: $scope.newMedicalRecord.allergies,
                operations: $scope.newMedicalRecord.operations
            };
            listMedicalRecordSrv.save({medicalRecord: newMedical},
                function (data) {
                    var playerId = data.player;
                    var index = 0;
                    for(index; index < $scope.Players.length; index++){
                        if($scope.Players[index]._id === playerId){
                            data.player = $scope.Players[index];
                        }
                    }
                    $scope.Medicals.push(data);
                    $('#create-medical').modal('hide'); //hide modal
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    $scope.newMedicalRecord = {};
                },
                function(error){
                    console.log(error);
                }
            );
        };

        $scope.editMedicalRecord = function(){
            var indexRecord = $scope.newMedicalRecord.index;
            var medicalId = $scope.newMedicalRecord.id;
            var newDataMedical = {
                player: $scope.newMedicalRecord.player ?
                    $scope.newMedicalRecord.player._id : null,
                age: $scope.newMedicalRecord.age,
                weight: $scope.newMedicalRecord.weight,
                height: $scope.newMedicalRecord.height,
                home: $scope.newMedicalRecord.home,
                allergies: $scope.newMedicalRecord.allergies,
                operations: $scope.newMedicalRecord.operations
            };

            listMedicalRecordSrv.update({medicalId: medicalId},
                {medicalRecord: newDataMedical},
                function (data) {
                    var playerId = data.player;
                    var index = 0;
                    for(index; index < $scope.Players.length; index++){
                        if($scope.Players[index]._id === playerId){
                            data.player = $scope.Players[index];
                        }
                    }
                    $scope.Medicals[indexRecord] = data;
                    $('#create-medical').modal('hide'); //hide modal
                    $('body').removeClass('modal-open');
                    $('.modal-backdrop').remove();
                    $scope.newMedicalRecord = {};
                },
                function(error){
                    console.log(error);
                }
            );
        };

        $scope.deleteMedical = function(medical, index) {
            var r = confirm("Esta seguro de eliminar la ficha medica de" +' ' +
                ''+ medical.player.name +' '+medical.player.lastname);
            if (r == true) {
                listMedicalRecordSrv.delete({medicalId: medical._id},
                    function(data) {
                        $scope.Medicals.splice(index, 1);
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
        };

        $scope.formEditMedical = function(medical, indexRecord){
            var index = 0;
            for(index; index < $scope.Players.length; index++){
                if($scope.Players[index]._id === medical.player._id)
                    break;
            }
            $scope.createMode = false;
            $scope.editMode = true;
            $scope.newMedicalRecord = {
                player: $scope.Players[index],
                age: medical.age,
                weight: medical.weight,
                height: medical.height,
                home: medical.home,
                allergies: medical.allergies,
                operations: medical.operations,
                id: medical._id,
                index: indexRecord
            };
        };

    }
]);