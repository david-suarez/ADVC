advcApp.controller('mainCtrl', [
    '$scope', '$routeParams', '$rootScope','publicationSrv', 'fileUploadSrv',
    'SessionService',
    function($scope, $routeParams, $rootScope, publicationSrv, fileUploadSrv,
             SessionService){

        var createIsReady = false;
        $scope.userCanCreatePub = false;
        if(SessionService.get('logged')) {
            $scope.userCanCreatePub = true;
        }

        $rootScope.$on('userAuthenticated', function(event, booleanData) {
            $scope.userCanCreatePub = booleanData;
        });

        $scope.isExpanded = true;
        $scope.showModalPub = false;
        $scope.newPublication = {
            title: '',
            description: '',
            linkPub: '',
            file: null
        };

        $scope.openCreateDialog = function(){
            $scope.showModalPub = !$scope.showModalPub;
            $scope.newPublication = {
                title: '',
                description: '',
                linkPub: '',
                file: null
            };
        };
        $scope.mainPublications = [];
        publicationSrv.get({type: 'main'},
            function(result){
                $scope.mainPublications = result.data;
            },
            function(error){
                console.log('******************************');
                console.error(error);
            }
        );

        $scope.downPublications = [];
        publicationSrv.get({type: 'secondary'},
            function(result){
                $scope.downPublications = result.data;
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

        $scope.getFile = function(file) {
            if (file) {
                return '/uploads/' + file;
            }
        };

        $scope.saveCallback = function(idFile) {
            var data;
            data = {
                title: $scope.newPublication.title,
                description: $scope.newPublication.description,
                reference: $scope.newPublication.reference,
                type: $scope.newPublication.type?$scope.newPublication.type:
                    'main',
                file: idFile
            };
            if ($scope.fieldsAreValid(data)) {
                publicationSrv.save({publication: data},
                    function(data){
                        if (data.type === 'main'){
                            $scope.mainPublications.push(data);
                        }
                        else if (data.type === 'secondary'){
                            $scope.downPublications.push(data);
                        }
                        $('#create-publication').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
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
            if(file.type === "application/pdf")
                $scope.newPublication.type = 'secondary';
            return true;
        };

        $scope.removePublication = function(publication) {
            console.log(publication._id);
            var type = publication.type;
            var indexPub = type === 'main' ?
                $scope.mainPublications.indexOf(publication) :
                $scope.downPublications.indexOf(publication);
            var r = confirm("Esta seguro que eliminar esta publicación?");
            if (r == true) {
                publicationSrv.delete({publicationId: publication._id},
                    function (data) {
                        if(type === 'main')
                            $scope.mainPublications.splice(indexPub, 1);
                        else
                            $scope.downPublications.splice(indexPub, 1);
                    },
                    function (error) {
                        console.log(error);
                    });
            }
        }
    }
]);