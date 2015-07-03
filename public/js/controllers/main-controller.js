advcApp.controller('mainCtrl', [
    '$scope', '$routeParams', 'publicationSrv', 'fileUploadSrv',
    function($scope, $routeParams, publicationSrv, fileUploadSrv){

        var createIsReady = false;

        $scope.isExpanded = true;
        $scope.showModal = false;
        $scope.publicationTypes = [
            {
                id: 'main',
                name: 'Publicacion Principal'
            },
            {
                id: 'secondary',
                name: 'Publicacion Secundaria'
            }
        ];
        $scope.newPublication = {
            title: '',
            description: '',
            linkPub: '',
            file: false
        };
        $scope.openCreateDialog = function(){
            $scope.showModal = !$scope.showModal;
            $scope.newPublication = {
                title: '',
                description: '',
                linkPub: '',
                file: false
            };
        };
        publicationSrv.get({},
            function(result){
                $scope.publications = result.data;
            },
            function(error){
                console.log('******************************');
                console.error(error);
            }
        );

        $scope.savePublication = function(){
            var file;
            if($scope.newPublication.file) {
                file = $scope.newPublication.file[0];
                return $scope.uploadFile(file, $scope.saveCallback);
            } else {
                return $scope.saveCallback();
            }
        };

        $scope.saveCallback = function(idImage) {
            var data;
            data = {
                title: $scope.newPublication.title,
                description: $scope.newPublication.description,
                reference: $scope.newPublication.reference,
                type: $scope.newPublication.type?$scope.publication.type:
                    'secondary',
                image: idImage
            };
            if ($scope.fieldsAreValid(data)) {
                publicationSrv.save({publication: data},
                    function(data){
                       $scope.publications.push(data);
                    },
                    function(error){
                        alert('Hubo un error al guardar la publicacion. ' +
                            'Por favor intente mas tarde')
                    });
            }
        };

        $scope.uploadFile = function(file, callback) {
            var self = this;
            if ($scope.fileIsValid(file)) {
                return fileUploadSrv.uploadFileToUrl(file, 'publications',
                    function(object, serverResponse) {
                        if (object != null) {
                            self.createIsReady = true;
                            return callback(object.result);
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

        /*
         Checks if some field in the list fields has a formatted invalid
         @param person [Object] person selected
         return false when some field is invalid otherwise true
         */

        $scope.fieldsAreValid = function(publication) {
            if ($scope.validateEmptyField(publication.title)) {
                alert('Por favor ingrese un titulo para la publicacion');
                return false;
            }
            if ($scope.validateEmptyField(publication.description)) {
                alert('Por favor ingrese una descripcion para la publicacion');
                return false;
            }
            return true;
        };

        $scope.validateEmptyField = function(fieldValue) {
            return fieldValue === void 0 || fieldValue.trim() === "";
        };

        $scope.fileIsValid = function(file) {
            if (!file) {
                alert('El formato de archivo que escogio es erroneo');
                return false;
            }
            if (file && file.type !== "image/jpeg"
                && file.type !== "image/png" && file.type !== "application/pdf") {
                alert('El formato de archivo que escogio es erroneo');
                return false;
            }
            return true;
        };
    }
]);