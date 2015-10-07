advcApp.controller('listUsersCtrl', ['$scope', '$routeParams',
    '$location', 'listUsersSrv', 'SessionService', 'reportSrv',
    function($scope, $routeParams, $location, listUsersSrv, SessionService,
             reportSrv) {
        $scope.Users = {};
        $scope.newUser = {};
        $scope.userId = {};
        $scope.createMode = false;
        $scope.editMode = false;
        var imageConfig = null;
        var restartValidationFields = function(){
            $scope.isNameValid = true;
            $scope.isLastNameValid = true;
            $scope.isUserNameValid = true;
            $scope.isPassValid = true;
        };

        restartValidationFields();

        listUsersSrv.get({},
            function(result){
                $scope.Users = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        $scope.roles = [
            'Directivo',
            'Comisión Técnica',
            'Comisión Médica',
            'Delegado'
        ];

        $scope.formCreateUser = function () {
            $scope.newUser={};
            $scope.isNameValid = true;
            $scope.isLastNameValid = true;
            $scope.isUserNameValid = true;
            $scope.createMode = true;
            $scope.editMode = false;
        };

        $scope.validateEditFields = function () {
            var name = $scope.newUser.name;
            var lastName = $scope.newUser.lastname;
            var userName = $scope.newUser.username;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            var lastNameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            var userNameRegEx = /^[a-zA-Z0-9_]{3,16}$/;

            if (!name || !name.trim() || !lastName || !lastName.trim() || !userName || !userName.trim()) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('No se permiten campos vacíos!!!');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            }
            if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            } else if (!lastNameRegEx.test(lastName)) {
                $scope.isNameValid = true;
                $scope.isLastNameValid = false;
                return false;
            } else if (!userNameRegEx.test(userName)) {
                $scope.isLastNameValid = true;
                $scope.isUserNameValid = false;
                return false;
            }
            return true;
        };

        $scope.validateFields = function () {
            var name = $scope.newUser.name;
            var lastName = $scope.newUser.lastname;
            var userName = $scope.newUser.username;
            var pass = $scope.newUser.password;
            var passRegEx = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{5,20})/;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            var lastNameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            var userNameRegEx = /^[a-zA-Z0-9_]{3,16}$/;

            if (!name || !name.trim() || !lastName || !lastName.trim() || !userName || !userName.trim()) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('No se permiten campos vacíos!!!');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            }
            if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            } else if (!lastNameRegEx.test(lastName)) {
                $scope.isNameValid = true;
                $scope.isLastNameValid = false;
                return false;
            } else if (!userNameRegEx.test(userName)) {
                $scope.isLastNameValid = true;
                $scope.isUserNameValid = false;
                return false;
            } else if (!passRegEx.test(pass)) {
                $scope.isUserNameValid = true;
                $scope.isPassValid = false;
                return false;
            }
            $scope.isPassValid = true;
            return true;
        };

        $scope.createUser = function () {
            var pass = $scope.newUser.password;
            var confirmPass = $scope.newUser.confirmPassword;
            $scope.newUser.club =
                $scope.newUser.club ? $scope.newUser.club._id : '';
            if($scope.validateFields()){
                if(pass === confirmPass){
                    var newUser = {
                        user: $scope.newUser
                    };
                    listUsersSrv.save(newUser,
                        function (data) {
                            $scope.Users.push(data);
                            restartValidationFields();
                            $('#create-user').modal('hide'); //hide modal
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $scope.newUser = {};
                        },
                        function(error){
                            if(error.status === 400){
                                $.noty.consumeAlert({layout: 'topCenter',
                                    type: 'warning', dismissQueue: true ,
                                    timeout:2000 });
                                alert("El nombre de usuario ya existe intente" +
                                    " con uno diferente.");
                                $.noty.stopConsumeAlert();
                            }else if(error.status === 500){
                                $.noty.consumeAlert({layout: 'topCenter',
                                    type: 'warning', dismissQueue: true ,
                                    timeout:2000 });
                                alert('Hubo un problema en el servidor. ' +
                                    'Por favor intente mas tarde');
                                $.noty.stopConsumeAlert();
                            }
                        }
                    );
                }
                else{
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert("Las contraseñas no coinciden.");
                    $.noty.stopConsumeAlert();
                }
            }

        };

        $scope.closeModal=function(){
            $scope.newUser = {};
            restartValidationFields();
        };

        $scope.editUser = function(user){
            $scope.createMode = false;
            $scope.editMode = true;
            $scope.newUser =
            {
                name: user.name,
                lastname: user.lastname,
                username: user.username,
                user_id: user._id,
                role: user.role,
                club: user.club
            }
        };

        $scope.updateUser = function(){
            var newUser =
            {
                name: $scope.newUser.name,
                lastname: $scope.newUser.lastname,
                username: $scope.newUser.username,
                role: $scope.newUser.role,
                club: $scope.newUser.club ? $scope.newUser.club._id : ''
            };
            if($scope.validateEditFields()) {
                listUsersSrv.update({user_id: $scope.newUser.user_id},
                    {newDataUser: newUser},
                    function (data) {
                        for (var index = 0; index < $scope.Users.length; index++) {
                            if ($scope.Users[index]._id === data._id) {
                                $scope.Users[index] = data;
                                break;
                            }
                        }
                        restartValidationFields();
                        $('#create-user').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                    },
                    function (error) {
                        if(error.status === 403){
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'warning', dismissQueue: true ,
                                timeout:5000 });
                            alert('Es posible que el usuario que intenta ' +
                                'modificar esta asignado como delegado de un' +
                                ' club y no se puede cambiar su rol por este ' +
                                'motivo. Por favor comprueba esta relación e ' +
                                'intente de nuevo.');
                            $.noty.stopConsumeAlert();
                        } else {
                            $.noty.consumeAlert({layout: 'topCenter',
                                type: 'warning', dismissQueue: true ,
                                timeout:2000 });
                            alert('Hubo un error al actualizar el usuario. ' +
                                'Por favor intente mas tarde');
                            $.noty.stopConsumeAlert();
                        }
                    }
                );
            }
        };


        $scope.deleteUser = function(userId, index){
            var currentUser = SessionService.get("userId");
            if(userId !== currentUser){
                var r = confirm("¿Quiere confirmar la eliminacion del usuario?");
                if (r === true) {
                    listUsersSrv.delete({user_id: userId}, function(data){
                            $scope.Users.splice(index,1);
                        },
                        function(error){
                            console.log(error);
                        }
                    );
                }
            } else{
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('No se puede borrar al usuario que esta actualmente' +
                    ' logeado.');
                $.noty.stopConsumeAlert();
            }

        };

        $scope.tableToJson = function(){
            var data = [];
            var cont = 0;

            data.push({
                'Nro': 'Nro',
                'Nombre Completo': 'Nombre Completo',
                'Nombre de Usuario': 'Nombre de usuario',
                'Rol de Usuario': 'Rol de usuario'
            });
            for(var i = 0; i < $scope.Users.length; i++){
                var tableRow = $scope.Users[i];
                cont = cont + 1;
                var number = String(cont);
                var rowData = {};

                rowData['Nro'] = number;
                rowData['Nombre Completo'] = tableRow.name +" "+tableRow.lastname;
                rowData['Nombre de Usuario'] = tableRow.username;
                rowData['Rol de Usuario'] = tableRow.role;

                data.push(rowData);
            }
            return data;
        };

        $scope.generateReport = function(){
            var table = $scope.tableToJson();
            reportSrv.generateReportOfUsers(table);
        }

    }

]);