advcApp.controller('mainCtrl', [
    '$scope', '$routeParams', '$rootScope','publicationSrv', 'fileUploadSrv',
    'SessionService', 'deleteFileSrv',
    function($scope, $routeParams, $rootScope, publicationSrv, fileUploadSrv,
             SessionService, deleteFileSrv){

        var createIsReady = false;
        $scope.userCanCreatePub = false;
        $scope.createMode = false;
        $scope.editMode = false;
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
            reference: '',
            file: null,
            fileName: ''
        };

        $scope.openCreateDialog = function(){
            $scope.formTitle = 'Formulario de creación de publicaciones';
            $scope.createMode = true;
            $scope.editMode = false;
            $scope.newPublication = {
                title: '',
                description: '',
                reference: '',
                file: null,
                fileName: ''
            };
            $("#fileElement").val('');
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
            if($scope.file) {
                file = $scope.file[0];
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

        $scope.saveCallback = function(idFile, fileName) {
            var data;
            data = {
                title: $scope.newPublication.title,
                description: $scope.newPublication.description,
                reference: $scope.newPublication.reference,
                type: $scope.newPublication.type,
                file: idFile,
                fileName: fileName
            };
            if ($scope.fieldsAreValid(data)) {
                publicationSrv.save({publication: data},
                    function(data){
                        if (data.type === 'main'){
                            $scope.mainPublications.unshift(data);
                        }
                        else if (data.type === 'secondary'){
                            $scope.downPublications.unshift(data);
                        }
                        $('#create-publication').modal('hide'); //hide modal
                        $("#fileElement").val('');
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
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

        $scope.uploadFile = function(file, callback) {
            var self = this;
            if ($scope.fileIsValid(file)) {
                return fileUploadSrv.uploadFileToUrl(file, 'publications',
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

        /*
         Checks if some field in the list fields has a formatted invalid
         @param person [Object] person selected
         return false when some field is invalid otherwise true
         */

        $scope.fieldsAreValid = function(publication) {
            if ($scope.validateEmptyField(publication.title)) {
                $.noty.consumeAlert({layout: 'topCenter', type: 'warning', dismissQueue: true , timeout:2000 });
                alert('Por favor ingrese un titulo para la publicacion');
                $.noty.stopConsumeAlert();


                return false;
            }
            if (!$scope.validateEmptyField(publication.description)){
                if(publication.description.length > 600 && !publication.file)
                {
                    $.noty.consumeAlert({layout: 'topCenter', type: 'warning', dismissQueue: true , timeout:2000 });
                    alert('Por favor ingrese una descripción con menos de ' +
                        '600 caracteres para la publicación');
                    $.noty.stopConsumeAlert();
                    return false;
                } else if(publication.description.length > 800 &&
                    !publication.file){
                    $.noty.consumeAlert({layout: 'topCenter', type: 'warning', dismissQueue: true , timeout:2000 });
                    alert('Por favor ingrese una descripción con menos de ' +
                        '900 caracterespara la publicación');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            } else {
                $.noty.consumeAlert({layout: 'topCenter', type: 'warning', dismissQueue: true , timeout:2000 });
                alert('Por favor ingrese una descripción para la publicación');
                $.noty.stopConsumeAlert();
                return false;
            }

            if(!$scope.validateEmptyField(publication.reference)){
                var regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
                if(!regex.test(publication.reference)){
                    $.noty.consumeAlert({layout: 'topCenter', type: 'warning', dismissQueue: true , timeout:2000 });
                    alert('Por favor ingrese un link externo válido para la ' +
                        'publicación.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            }
            return true;
        };

        $scope.validateEmptyField = function(fieldValue) {
            return fieldValue === void 0 || fieldValue.trim() === "";
        };

        $scope.fileIsValid = function(file) {
            if (!file) {
                $.noty.consumeAlert({layout: 'topCenter', type: 'warning', dismissQueue: true , timeout:2000 });
                alert('El formato de archivo que escogio es erroneo');
                $.noty.stopConsumeAlert();
                return false;
            }
            if (file && file.type !== "image/jpeg"
                && file.type !== "image/png" && file.type !== "application/pdf") {
                $.noty.consumeAlert({layout: 'topCenter', type: 'warning', dismissQueue: true , timeout:2000 });
                alert('El formato de archivo que escogio es erroneo');
                $.noty.stopConsumeAlert();
                $("#fileElement").val('');
                return false;
            }
            if(file.type === "application/pdf")
                $scope.newPublication.type = 'secondary';
            else
                $scope.newPublication.type = 'main';
            return true;
        };

        $scope.removePublication = function(publication) {

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
        };

        $scope.openUpdatePublication = function(publication, index, type) {
            $scope.formTitle = 'Formulario de actualización de publicaciones';
            $scope.createMode = false;
            $scope.editMode = true;
            $scope.newPublication = {
                title: publication.title,
                description: publication.description,
                reference: publication.reference,
                file: publication.file,
                fileName: publication.fileName,
                id: publication._id,
                index: index,
                type: publication.type
            };
        };

        $scope.deleteFile = function(){
            var resp = confirm('¿Esta seguro que quiere borrar el archivo ' +
                'de forma permanente?');
            if(resp){
                var pubId = $scope.newPublication.id;
                deleteFileSrv.delete({publicationId: pubId},
                    {fileName: $scope.file},
                    function(data){
                        var index = $scope.newPublication.index;
                        var type = $scope.newPublication.type;
                        if(type === 'main' &&
                            $scope.mainPublications[index].file ===
                            $scope.file) {
                            $scope.mainPublications[index] = data;
                        } else if($scope.downPublications[index].file ===
                            $scope.file){
                            $scope.downPublications.splice(index, 1);
                            $scope.mainPublications.unshift(data);
                        }
                        $.noty.consumeAlert({layout: 'topCenter',
                            type: 'success', dismissQueue: true ,
                            timeout:2000 });
                        alert('Se elimino el archivo correctamente');
                        $.noty.stopConsumeAlert();
                        $scope.newPublication.fileName = '';
                        $scope.file = '';
                        $scope.newPublication.type = 'main';
                    },
                    function(error){
                        $.noty.consumeAlert({layout: 'topCenter',
                            type: 'error', dismissQueue: true ,
                            timeout:2000 });
                        alert('Hubo un problema al eliminar el archivo. ' +
                            'Por favor intente nuevamente.');
                        $.noty.stopConsumeAlert()
                    });
            }
        };

        $scope.updatePublication = function(){
            var file;
            if(typeof($scope.file) === 'object') {
                file = $scope.file[0];
                return $scope.uploadFile(file, $scope.updateCallback);
            } else {
                return $scope.updateCallback();
            }
        };

        $scope.updateCallback = function(idFile, fileName){
            var data;
            var pubId = $scope.newPublication.id;
            data = {
                title: $scope.newPublication.title,
                description: $scope.newPublication.description,
                reference: $scope.newPublication.reference,
                type: $scope.newPublication.type,
                file: idFile,
                fileName: fileName
            };
            if ($scope.fieldsAreValid(data)) {
                publicationSrv.update({publicationId: pubId},
                    {newDataPublication: data},
                    function(data){
                        var pub = data.pub;
                        var prevType = data.prevType;
                        updatePublications(pub, prevType);
                        $('#create-publication').modal('hide'); //hide modal
                        $("#fileElement").val('');
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                    },
                    function(error){
                        console.log(error);
                        $.noty.consumeAlert({layout: 'topCenter',
                            type: 'warning', dismissQueue: true ,
                            timeout:2000 });
                        alert('Hubo un error al actualizar la publicacion. ' +
                            'Por favor intente mas tarde');
                        $.noty.stopConsumeAlert();
                    });
            }
        };

        var updatePublications = function(publication, prevType){
            if(publication.type === prevType){
                if(prevType === 'main'){
                    var index = 0;
                    for(index; index < $scope.mainPublications.length; index++){
                        if($scope.mainPublications[index]._id
                            === publication._id){
                            $scope.mainPublications[index] = publication;
                            break;
                        }
                    }
                }else if(prevType === 'secondary'){
                    var index = 0;
                    for(index; index < $scope.downPublications.length; index++){
                        if($scope.downPublications[index]._id
                            === publication._id){
                            $scope.downPublications[index] = publication;
                            break;
                        }
                    }
                }
            } else{
                removePublications(publication, prevType);
            }
        };

        var removePublications = function(publication, prevType){
            if(prevType === 'main'){
                var index = 0;
                for(index; index < $scope.mainPublications.length; index++){
                    if($scope.mainPublications[index]._id
                        === publication._id){
                        break;
                    }
                }
                $scope.mainPublications.splice(index, 1);
                $scope.downPublications.unshift(publication);
            } else if(prevType === 'secondary') {
                var index = 0;
                for(index; index < $scope.downPublications.length; index++){
                    if($scope.downPublications[index]._id
                        === publication._id){
                        break;
                    }
                }
                $scope.downPublications.splice(index, 1);
                $scope.mainPublications.unshift(publication);
            }
        };
    }
]);