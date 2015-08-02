advcApp.controller('listPlayersCtrl', ['$scope', '$routeParams',
    '$location', 'listPlayersSrv', '$modal', 'fileUploadSrv',
    function($scope, $routeParams, $location, listPlayersSrv, $modal,
             fileUploadSrv) {
        $scope.filteredPlayers = {};
        $scope.defaulImage = 'img/default-avatar.png';

        $scope.closeAlert = function () {
            $scope.reason = null;
        };
        /*
         Refreshes the local variables in angular.
         */

        $scope.refresh = function() {
            if (!$scope.$$phase) {
                return $scope.$apply();
            }
        };

        $scope.open = function () {
            this.modalInstance = $modal.open({
                templateUrl: 'partials/wizard.html',
                controller: 'listPlayersCtrl'
            });

            this.modalInstance.result
                .then(function (data) {
                    $scope.closeAlert();
                    $scope.summary = data;
                }, function (reason) {
                    $scope.reason = reason;
                });
        };

        listPlayersSrv.get({},
            function(result){
                $scope.filteredPlayers = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        var createIsReady = false;
        $scope.formPlayerName = 'Formulario de creación de jugadores';
        $scope.defaulImage = 'img/default-avatar.png';
        $scope.wizard = {};
        $scope.today = new Date();
        $scope.format = 'dd/MM/yyyy';
        $scope.branches = [
            'Femenino',
            'Masculino'
        ];
        $scope.extensions = [
            'BN',
            'CB',
            'CH',
            'LP',
            'PA',
            'OR',
            'PT',
            'SC',
            'TJ'
        ];
        $scope.steps = [
            {
                name: 'Información personal',
                indicator: 'one'
            },
            {
                name: 'Lugar y partida de nacimiento',
                indicator: 'two'
            },
            {
                name: 'Dirección',
                indicator: 'three'
            }
        ];
        $scope.step = 0;

        $scope.isFirstStep = function () {
            return $scope.step === 0;
        };

        $scope.isLastStep = function () {
            return $scope.step === ($scope.steps.length - 1);
        };

        $scope.isCurrentStep = function (step) {
            return $scope.step === step;
        };

        $scope.setCurrentStep = function (step) {
            if($scope.step === 0 && personalInfoIsValid()){
                $scope.step = step;
            }else if($scope.step === 1 && placeBirthIsValid()) {
                $scope.step = step;
            }else if($scope.step === 2 && addressIsValid()) {
                $scope.step = step;
            }
        };

        $scope.getCurrentStep = function () {
            return $scope.steps[$scope.step].indicator;
        };

        $scope.getNextLabel = function () {
            return ($scope.isLastStep()) ? 'Guardar' : 'Siguente';
        };

        $scope.handlePrevious = function () {
            $scope.step -= ($scope.isFirstStep()) ? 0 : 1;
        };

        var addressIsValid = function(){
            return true;
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

        $scope.openDate = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        var personalInfoIsValid = function(){
            var name = $scope.wizard.name;
            var lastName = $scope.wizard.lastname;
            var sex = $scope.wizard.sex;
            var ci = $scope.wizard.ci;
            var ext = $scope.wizard.ext;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            if (!name || !name.trim() || !lastName || !lastName.trim()
                || !sex || !ci) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('No se permiten campos vacíos!!!');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!ext) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Tiene que seleccionar una extencion para el documento' +
                    ' de identidad');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!nameRegEx.test(name)) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('El nombre tiene caracteres inválidos.');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!nameRegEx.test(lastName)) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('El nombre tiene caracteres inválidos.');
                $.noty.stopConsumeAlert();
                return false;
            }
            return true;
        };

        var placeBirthIsValid = function(){
            var regEx = /^([a-z ñáéíóú]{2,60})$/i;
            if(!$scope.wizard.dateOfBirth) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La fecha de nacimiento es inválida.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!$scope.wizard.nationality){
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La nacionalidad es requerida.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!regEx.test($scope.wizard.nationality)) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La nacionalidad tiene caracteres invalidos.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!$scope.wizard.cityOfBirth) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La ciudad de nacimiento es requerida.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!regEx.test($scope.wizard.cityOfBirth)) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La ciudad de nacimiento tiene caracteres invalidos.');
                $.noty.stopConsumeAlert();
                return false;
            }
            return true;
        };

        $scope.handleNext = function () {
            if ($scope.isLastStep()) {
                if(addressIsValid()){
                    $scope.savePlayer();
                }
            } else {
                if($scope.step === 0 && personalInfoIsValid()){
                    $scope.step += 1;
                }else if($scope.step === 1 && placeBirthIsValid()) {
                    $scope.step += 1;
                }

            }
        };

        $scope.dismiss = function(reason) {
            $scope.$close(reason);
        };

        /*
         shows the browser for select image
         @todo move this to directive
         */

        $scope.doClick = function() {
            $("#fileElement").click();
        };

        $scope.fileIsValid = function(file){
            if (!file) {
                $.noty.consumeAlert({layout: 'topCenter', type: 'warning',
                    dismissQueue: true , timeout:2000 });
                alert('El formato de archivo que escogio es erroneo');
                $.noty.stopConsumeAlert();
                return false;
            }
            if (file && file.type !== "image/jpeg"
                && file.type !== "image/png") {
                $.noty.consumeAlert({layout: 'topCenter', type: 'warning',
                    dismissQueue: true , timeout:2000 });
                alert('El formato de archivo que escogio es erroneo');
                $.noty.stopConsumeAlert();
                $("#fileElement").val('');
                return false;
            }
            $scope.file = file;
            return true;
        };

        $scope.getImage = function(image) {
            if (image) {
                return '/uploads/thumbs/' + image;
            } else {
                return $scope.defaulImage;
            }
        };

        $scope.hasTmpImage = function(){
            return $scope.file ? true : false;
        };

        $scope.savePlayer = function(){
            if($scope.file) {
                return $scope.uploadFile($scope.file, $scope.saveCallback);
            } else {
                return $scope.saveCallback();
            }
        };

        $scope.uploadFile = function(file, callback) {
            var self = this;
            if ($scope.fileIsValid(file)) {
                return fileUploadSrv.uploadFileToUrl(file, 'players',
                    function(object, serverResponse) {
                        if (object != null) {
                            self.createIsReady = true;
                            return callback(object.result, file.name);
                        } else {
                            self.createIsReady = true;
                            if (serverResponse === 'Unauthorized') {
                                return $rootScope.$emit(
                                    'userUnauthorizedUploadFile');
                            } else {
                                return console.log('There was an error in ' +
                                    'server side.');
                            }
                        }
                    });
            } else {
                return createIsReady = true;
            }
        };

        $scope.fieldsAreValid = function(){
            return personalInfoIsValid() && placeBirthIsValid()
                && addressIsValid()
        };

        $scope.saveCallback = function(idFile, fileName) {
            var data;
            data = {
                name: $scope.wizard.name,
                lastname: $scope.wizard.lastname,
                dateOfBirth: $scope.wizard.dateOfBirth,
                ci: $scope.wizard.ci + '' + $scope.wizard.ext,
                branch: $scope.wizard.sex,
                nationality: $scope.wizard.nationality,
                cityOfBirth: $scope.wizard.cityOfBirth,
                bookBirthCert: $scope.wizard.book,
                departureBirthCert: $scope.wizard.part,
                image: idFile,
                phoneNumber: $scope.wizard.phone,
                address: $scope.wizard.address,
                zone: $scope.wizard.zone,
                postcode: $scope.wizard.postCode,
                officeBirthCert: $scope.wizard.office
            };
            if ($scope.fieldsAreValid()) {
                $scope.$close($scope.wizard);
                listPlayersSrv.save({player: data},
                    function(data){
                        $scope.filteredPlayers.unshift(data);
                        $scope.refresh();
                    },
                    function(error){
                        console.log(error);
                        $.noty.consumeAlert({layout: 'topCenter',
                            type: 'warning', dismissQueue: true ,
                            timeout:2000 });
                        alert('Hubo un error al guardar la publicacion. ' +
                            'Por favor intente mas tarde');
                        $.noty.stopConsumeAlert();
                    });
            }
        };
    }
]);
