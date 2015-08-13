advcApp.controller('listPlayersCtrl', ['$scope', '$routeParams',
    '$location', 'listPlayersSrv', '$modal', 'fileUploadSrv',
    function($scope, $routeParams, $location, listPlayersSrv, $modal,
             fileUploadSrv) {
        $scope.currentClubId = $routeParams.clubId;
        $scope.filteredPlayers = {};
        $scope.defaultImage = 'img/default-avatar.png';
        $scope.ciRequired = false;
        $scope.currentPlayer = {};
        $scope.oldDataCurrentPlayer = {};
        $scope.wizard = {};
        $scope.isSavingRecord = false;
        var playerId = $routeParams.playerId;
        /*
         Refreshes the local variables in angular.
         */

        $scope.refresh = function() {
            if (!$scope.$$phase) {
                return $scope.$apply();
            }
        };
        if(!playerId){
            listPlayersSrv.get({ club: $scope.currentClubId },
                function(result){
                    $scope.filteredPlayers = result.data;
                },
                function(error){
                    console.log(error);
                }
            );
        } else{
            listPlayersSrv.get({playerId: playerId},
                function(playerResult){
                    $scope.currentPlayer = playerResult;
                    $scope.oldDataCurrentPlayer = angular.copy(playerResult);
                    $scope.wizard.age =
                        $scope.calculateAge($scope.currentPlayer.dateOfBirth);
                },
                function(error){
                    console.log(error)
                }
            );
        }


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
            'EXT',
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
                name: 'Inf. personal',
                indicator: 'one'
            },
            {
                name: 'Nacimiento e Identificación',
                indicator: 'two'
            },
            {
                name: 'Dirección',
                indicator: 'three'
            },
            {
                name: 'Ord. técnico',
                indicator: 'four'
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
            else if($scope.step === 3 && orderIsValid()) {
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
            var address = $scope.wizard.address;
            var phone = $scope.wizard.phone;
            var zone = $scope.wizard.zone;
            if(!address || !address.trim() || !phone
                || !zone || !zone.trim()) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Por favor llene todos los campos requeridos.');
                $.noty.stopConsumeAlert();
                return false;
            }
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

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' &&
            ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        var personalInfoIsValid = function(){
            var name = $scope.wizard.name;
            var lastName = $scope.wizard.lastname;
            var secondLastName = $scope.wizard.secondlastname;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            if (!name || !name.trim() || ((!lastName || !lastName.trim())
                && (!secondLastName || !secondLastName.trim()))) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Por favor llene todos los campos.');
                $.noty.stopConsumeAlert();
                return false;
            }else if(!nameRegEx.test(name)) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('El nombre tiene caracteres inválidos.');
                $.noty.stopConsumeAlert();
                return false;
            }
            if(lastName) {
                if(!nameRegEx.test(lastName)){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('El apellido paterno tiene caracteres inválidos.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            }
            if(secondLastName) {
                if(!nameRegEx.test(secondLastName)){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('El apellido materno tiene caracteres inválidos.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            }
            if(!$scope.file){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Tiene que agregar una foto para el jugador.');
                $.noty.stopConsumeAlert();
                return false;
            }
            return true;
        };

        var placeBirthIsValid = function(){
            var regEx = /^([a-z ñáéíóú]{2,60})$/i;
            var ci = $scope.wizard.ci;
            var ext = $scope.wizard.ext;
            if(!$scope.wizard.dateOfBirth) {
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('La fecha de nacimiento es inválida.');
                $.noty.stopConsumeAlert();
                return false;
            }else if ($scope.calculateAge($scope.wizard.dateOfBirth) > 10){
                if (!ci){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('Tiene que ingresar un número de documento de ' +
                        'identidad');
                    $.noty.stopConsumeAlert();
                    return false;
                }else  if (ci < 10000){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('El número de documento de identidad es inválido');
                    $.noty.stopConsumeAlert();
                    return false;
                }else if (!ext){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('Tiene que seleccionar una extencion para el documento' +
                        ' de identidad');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            }else if ($scope.calculateAge($scope.wizard.dateOfBirth) < 4){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
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
            if(ci || ext) {
                if (ci < 10000){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('El número de documento de identidad es inválido');
                    $.noty.stopConsumeAlert();
                    return false;
                }else if (!ext){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('Tiene que seleccionar una extencion para el ' +
                        'documento de identidad');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            }
            return true;
        };

        var orderIsValid = function(){
            var asoOrigin = $scope.wizard.asoOrigin;
            var branch = $scope.wizard.branch;
            if(!asoOrigin || !asoOrigin.trim()){
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('Por favor llene todos los campos requeridos.');
                $.noty.stopConsumeAlert();
                return false;
            } else if(!branch){
                $.noty.consumeAlert({
                    layout: 'topCenter',
                    type: 'warning', dismissQueue: true,
                    timeout: 2000
                });
                alert('Por favor llene todos los campos requeridos.');
                $.noty.stopConsumeAlert();
                return false;
            }
            return true;
        };

        $scope.handleNext = function () {
            if ($scope.isLastStep()) {
                if(orderIsValid()){
                    $scope.isSavingRecord = true;
                    $scope.savePlayer();
                }
            } else {
                if($scope.step === 0 && personalInfoIsValid()){
                    $scope.step += 1;
                }else if($scope.step === 1 && placeBirthIsValid()) {
                    $scope.step += 1;
                }else if($scope.step === 2 && addressIsValid()) {
                    $scope.step += 1;
                }
            }
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
            } else if (file && file.type !== "image/jpeg"
                && file.type !== "image/png") {
                $.noty.consumeAlert({layout: 'topCenter', type: 'warning',
                    dismissQueue: true , timeout:2000 });
                alert('El formato de archivo que escogio es erroneo');
                $.noty.stopConsumeAlert();
                $("#fileElement").val('');
                return false;
            } else {
                $scope.tmpImage = window.URL.createObjectURL(file);
                return true;
            }
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
                var file = $scope.file[0];
                return $scope.uploadFile(file, $scope.saveCallback);
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
                && addressIsValid() && orderIsValid()
        };

        $scope.saveCallback = function(idFile, fileName) {
            var data;
            data = {
                name: $scope.wizard.name,
                lastname: $scope.wizard.lastname,
                secondlastname: $scope.wizard.secondlastname,
                dateOfBirth: $scope.wizard.dateOfBirth,
                ci: $scope.wizard.ci,
                ciExtension: $scope.wizard.ext,
                branch: $scope.wizard.branch,
                nationality: $scope.wizard.nationality,
                cityOfBirth: $scope.wizard.cityOfBirth,
                bookBirthCert: $scope.wizard.book,
                departureBirthCert: $scope.wizard.part,
                image: idFile,
                phoneNumber: $scope.wizard.phone,
                address: $scope.wizard.address,
                zone: $scope.wizard.zone,
                postcode: $scope.wizard.postCode,
                officeBirthCert: $scope.wizard.office,
                // By the moment until create a view for players only
                club: $scope.currentClubId ? $scope.currentClubId : null,
                asoOrigin: $scope.wizard.asoOrigin
            };
            if ($scope.fieldsAreValid()) {
                listPlayersSrv.save({player: data},
                    function(data){
                        $scope.handleCancel();
                        $scope.filteredPlayers.unshift(data);
                        $('#create-player').modal('hide'); //hide modal
                        $("#fileElement").val('');
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
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
            if (age >= 1900){
                age -= 1900;
            }
            return age;
        };

        $scope.dateOfBirthChange = function(){
            var dateOfBirth = $scope.wizard.dateOfBirth ?
                $scope.wizard.dateOfBirth : $scope.currentPlayer.dateOfBirth;
            var age = $scope.calculateAge(dateOfBirth);
            if(age > 11){
                $scope.ciRequired = true;
            }else if(age < 4){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('La fecha de nacimiento es inválida.');
                $.noty.stopConsumeAlert();
            }
            $scope.wizard.age = age;
        };

        $scope.handleCancel = function(){
            $scope.wizard = {};
            $scope.file = null;
            $scope.tmpImage = null;
            $scope.step = 0;
            $scope.isSavingRecord = false;
        };

        /*
         Redirects to people board. when press double click in a
         person
         @param person [Object] person selected
         */

        $scope.goToKardex = function(player) {
            var url;
            var clubName = $routeParams.clubName;
            url = '/listClubs/'+ clubName + '/'+ player.club + '/players/' +
                player._id + '/kardex';
            return $location.path(url);
        };

        $scope.backPrevPage = function() {
            var url;
            var clubName = $routeParams.clubName;
            var clubId = $routeParams.clubId;
            url = '/listClubs/'+ clubName + '/'+ clubId + '/clubInfo';
            return $location.path(url);
        };

        $scope.editCurrentPlayer = function(){
            $scope.isEditing = true;
        };

        $scope.cancelEditCurrentPlayer = function(){
            $scope.currentPlayer = angular.copy($scope.oldDataCurrentPlayer);
            $scope.isEditing = false;
        };

        $scope.updateCurrentPlayer = function(){
            var playerId = $scope.currentPlayer._id;
            var data = $scope.currentPlayer;
            listPlayersSrv.update({playerId: playerId}, {newDataPlayer: data},
            function(dataResult){
                $scope.oldDataCurrentPlayer = dataResult;
                $scope.isEditing = false;
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'success', dismissQueue: true ,
                    timeout:2000 });
                alert('Los cambios se guardaron correctamente.');
                $.noty.stopConsumeAlert();
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
        };
    }
]);
