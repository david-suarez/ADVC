advcApp.controller('ModalCtrl', ['$rootScope', '$scope', '$modalInstance', 'listPlayersSrv',
    'fileUploadSrv',
    function ($rootScope, $scope, $modalInstance, listPlayersSrv, fileUploadSrv) {
        var modal = this;
        var createIsReady = false;
        modal.formPlayerName = 'Formulario de creación de jugadores';
        $scope.defaulImage = 'img/default-avatar.png';
        $scope.file = null;
        modal.wizard = {};
        $scope.today = new Date();
        $scope.format = 'dd/MM/yyyy';
        modal.branch = [
            'Femenino',
            'Masculino'
        ];
        modal.extension = [
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
        modal.steps = [
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
        modal.step = 0;

        modal.isFirstStep = function () {
            return modal.step === 0;
        };

        modal.isLastStep = function () {
            return modal.step === (modal.steps.length - 1);
        };

        modal.isCurrentStep = function (step) {
            return modal.step === step;
        };

        modal.setCurrentStep = function (step) {
            if(modal.step === 0 && personalInfoIsValid()){
                modal.step = step;
            }else if(modal.step === 1 && placeBirthIsValid()) {
                modal.step = step;
            }else if(modal.step === 2 && addressIsValid()) {
                modal.step = step;
            }
        };

        modal.getCurrentStep = function () {
            return modal.steps[modal.step].indicator;
        };

        modal.getNextLabel = function () {
            return (modal.isLastStep()) ? 'Guardar' : 'Siguente';
        };

        modal.handlePrevious = function () {
            modal.step -= (modal.isFirstStep()) ? 0 : 1;
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
            modal.minDate = modal.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            modal.opened = true;
        };

        var personalInfoIsValid = function(){
            var name = modal.wizard.name;
            var lastName = modal.wizard.lastname;
            var sex = modal.wizard.sex;
            var ci = modal.wizard.ci;
            var ext = modal.wizard.ext;
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
            if(!modal.wizard.dateOfBirth) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La fecha de nacimiento es inválida.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!modal.wizard.nationality){
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La nacionalidad es requerida.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!regEx.test(modal.wizard.nationality)) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La nacionalidad tiene caracteres invalidos.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!modal.wizard.cityOfBirth) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La ciudad de nacimiento es requerida.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!regEx.test(modal.wizard.cityOfBirth)) {
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

        modal.handleNext = function () {
            if (modal.isLastStep()) {
                if(addressIsValid()){
                    $scope.savePlayer();
                }
            } else {
                if(modal.step === 0 && personalInfoIsValid()){
                    modal.step += 1;
                }else if(modal.step === 1 && placeBirthIsValid()) {
                    modal.step += 1;
                }

            }
        };

        modal.dismiss = function(reason) {
            $modalInstance.dismiss(reason);
        };

        /*
         shows the browser for select image
         @todo move this to directive
         */

        modal.doClick = function() {
            $("#fileElement").click();
        };

        $scope.fileIsValid = function(file){
            $scope.defaulImage = file;
            return true;
        };

        $scope.getImage = function(image) {
            if (image) {
                return Constants.DEFAULT_PATH + image;
            } else {
                return Constants.DEFAULT_IMAGE;
            }
        };

        modal.hasTmpImage = function(){
            return $scope.file ? true : false;
        };

        $scope.savePlayer = function(){
            var file;
            if($scope.file) {
                file = $scope.file[0];
                return $scope.uploadFile(file, $scope.saveCallback);
            } else {
                return $scope.saveCallback();
            }
        };

        $scope.uploadFile = function(file, callback) {
            var self = this;
            if ($scope.fileIsValid(file)) {
                return fileUploadSrv.uploadFileToUrl(file, 'player',
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
                name: modal.wizard.name,
                lastname: modal.wizard.lastname,
                dateOfBirth: modal.wizard.dateOfBirth,
                ci: modal.wizard.ci + '' + modal.wizard.ext,
                branch: modal.wizard.sex,
                nationality: modal.wizard.nationality,
                cityOfBirth: modal.wizard.cityOfBirth,
                bookBirthCert: modal.wizard.book,
                departureBirthCert: modal.wizard.part,
                image: idFile,
                phoneNumber: modal.wizard.phone,
                address: modal.wizard.address,
                zone: modal.wizard.zone,
                postcode: modal.wizard.postCode,
                officeBirthCert: modal.wizard.office
            };
            if ($scope.fieldsAreValid()) {
                listPlayersSrv.save({player: data},
                    function(data){
                        $rootScope.filteredPlayers.unshift(data);
                        $modalInstance.close(modal.wizard);
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