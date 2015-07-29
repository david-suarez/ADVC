advcApp.controller('listMedicalRecordCtrl', ['$scope', '$routeParams',
    '$location','listMedicalRecordSrv','listPlayersSrv',
    function($scope, $routeParams, $location, listMedicalRecordSrv,
             listPlayersSrv) {
        $scope.Medicals = {};
        $scope.newMedicalRecord = {};
        $scope.Players = {};
        $scope.format = 'dd/MM/yyyy';

        $scope.formCreateMedical = function () {
            $scope.newMedicalRecord = {};
            $scope.createMode = true;
            $scope.editMode = false;
        };

        var restartValidationFields = function(){
            $scope.isWeightValid = true;
            $scope.isHeightValid = true;
            $scope.isHomeValid = true;
        };

        restartValidationFields();

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

        listMedicalRecordSrv.get({},
            function(result){
                $scope.Medicals = result.data;
            },
            function(error){

                console.log(error);
            }
        );

        $scope.calculateAge = function(dateOfBirth){
                var today = new Date();
                var todayYear = today.getYear();
                var todayMonth = today.getMonth();
                var todayDate = today.getDate();


                var birthDate = new Date(dateOfBirth);

                var date = birthDate.getDate();
                var month = birthDate.getMonth();
                var year = birthDate.getYear();
                var age = (todayYear + 1900) - year;

                if ( todayMonth < (month - 1)){
                    age--;
                }
                if (((month - 1) == todayMonth) && (todayDate < date)){
                    age--;
                }
                if (age > 1900){
                    age -= 1900;
                }
                return age;
            };

        $scope.validateFields = function () {
            var weight = $scope.newMedicalRecord.weight;
            var height = $scope.newMedicalRecord.height;
            var home= $scope.newMedicalRecord.home;
            var weightRegEx = /^-?[0-9]+([\.][0-9]*)?$/;
            var heightRegEx = /^-?[0-9]+([\.][0-9]*)?$/;
            var homeRegEx = /^[0-9a-zA-Zñ]+( ?[0-9a-zA-Zñ])+$/;
            if (!weight){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese el peso del jugador.');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!weightRegEx.test(weight)) {
                $scope.isWeightValid = false;
                return false;

            }else if (!height) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese el altura del jugador.');
                $.noty.stopConsumeAlert();
                $scope.isWeightValid = true;
                return false;
            }else if (!heightRegEx.test(height)) {
                $scope.isWeightValid = true;
                $scope.isHeightValid = false;
                return false;

            }else if (!home || !home.trim()) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese la direccion del jugador.');
                $.noty.stopConsumeAlert();
                $scope.isHeightValid = true;
                return false;
            }else if (!homeRegEx.test(home)) {
                $scope.isHeightValid = true;
                $scope.isHomeValid = false;
                return false;
            }
            return true;
        };

        $scope.createMedicalRecord= function () {
            var newMedical = {
                player: $scope.newMedicalRecord.player ?
                    $scope.newMedicalRecord.player._id : null,
                weight: $scope.newMedicalRecord.weight,
                height: $scope.newMedicalRecord.height,
                home: $scope.newMedicalRecord.home,
                allergies: $scope.newMedicalRecord.allergies,
                operations: $scope.newMedicalRecord.operations
            };
            if($scope.validateFields()){
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
                        restartValidationFields();
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
        };

        $scope.editMedicalRecord = function(){
            var indexRecord = $scope.newMedicalRecord.index;
            var medicalId = $scope.newMedicalRecord.id;
            var newDataMedical = {
                player: $scope.newMedicalRecord.player ?
                    $scope.newMedicalRecord.player._id : null,
                weight: $scope.newMedicalRecord.weight,
                height: $scope.newMedicalRecord.height,
                home: $scope.newMedicalRecord.home,
                allergies: $scope.newMedicalRecord.allergies,
                operations: $scope.newMedicalRecord.operations
            };

            if($scope.validateFields()) {
                listMedicalRecordSrv.update({medicalId: medicalId},
                    {medicalRecord: newDataMedical},
                    function (data) {
                        var playerId = data.player;
                        var index = 0;
                        for (index; index < $scope.Players.length; index++) {
                            if ($scope.Players[index]._id === playerId) {
                                data.player = $scope.Players[index];
                            }
                        }
                        $scope.Medicals[indexRecord] = data;
                        restartValidationFields();
                        $('#create-medical').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        $scope.newMedicalRecord = {};

                    },
                    function (error) {
                        console.log(error);
                    }
                );
            }
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

        $scope.closeModal=function(){
            $scope.newMedicalRecord = {};
            restartValidationFields();
        };
        $scope.obtainFormatDate = function(date){
            if(date) {
                var foundDate = new Date(date);
                return foundDate.toLocaleDateString();
            }
            return '';
        };
        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
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