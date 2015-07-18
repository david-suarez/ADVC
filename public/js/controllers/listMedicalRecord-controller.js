advcApp.controller('listMedicalRecordCtrl', ['$scope', '$routeParams',
    '$location','listMedicalRecordSrv','listPlayersSrv',
    function($scope, $routeParams, $location, listMedicalRecordSrv,listPlayersSrv) {
        $scope.Medicals = {};
        $scope.newMedicalRecord = {};
        $scope.Players = {};

        $scope.formCreateMedical = function () {
            $scope.createMode = true;
            $scope.editMode = false;
        };

        listPlayersSrv.get({},
            function(result){
                for(var index in result.data){
                    var player = result.data[index];
                    var fullName = player.name + ' ' + player.lastname
                    result.data[index].fullName = fullName;
                    console.log(fullName);
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
                //console.log($scope.Medicals);
            },
            function(error){

                console.log("aca"+ error);
            }
        );

        $scope.createMedicalRecord= function () {
            var newMedical = {
                player: $scope.newMedicalRecord.player ?
                    $scope.newMedicalRecord.player. _id : null,
                age: $scope.newMedicalRecord.age,
                weight: $scope.newMedicalRecord.weight,
                height: $scope.newMedicalRecord.height,
                home: $scope.newMedicalRecord.home,
                allergies: $scope.newMedicalRecord.allergies,
                operations: $scope.newMedicalRecord.operations
            };
            listMedicalRecordSrv.save({medicalRecord: newMedical},
                function (data) {
                    var medicalId = data.player;
                    var index = 0;
                    for(index; index < $scope.Players.length; index++){
                        if($scope.Players[index]._id === medicalId){
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
        }

        $scope.formDeleteMedical = function (medical) {
            var r = confirm("Esta seguro de eliminar la ficha medica de" +' '+ medical.player.name +' '+medical.player.lastname);
            console.log(medical._id);
            if (r == true) {
                listMedicalRecordSrv.delete({medicalId: medical._id},
                    function (data) {
                        var index = 0;
                        $scope.Medicals.splice(index, 1);
                    }
                );
            }
        };

    }
]);