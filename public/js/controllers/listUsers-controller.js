debugger;
advcApp.controller('listUsersCtrl', ['$scope', '$routeParams',
    '$location', 'listUsersSrv', 'SessionService',
    function($scope, $routeParams, $location, listUsersSrv, SessionService) {
        $scope.Users = {};
        $scope.newUser = {};
        $scope.idUser = {};
        $scope.createMode = false;
        $scope.editMode = false;
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
            var userName = $scope.newUser.user_name;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            var lastNameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            var userNameRegEx = /^[a-zA-Z0-9_]{3,16}$/;

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
            var userName = $scope.newUser.user_name;
            var pass = $scope.newUser.password;
            var passRegEx = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{5,20})/;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            var lastNameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            var userNameRegEx = /^[a-zA-Z0-9_]{3,16}$/;

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

            if($scope.validateFields()){
                if(pass === confirmPass){
                    var newUser = {
                        user: $scope.newUser
                    };
                    listUsersSrv.save(newUser,
                        function (data) {
                            $scope.Users.push(data);
                            $('#create-user').modal('hide'); //hide modal
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $scope.newUser = {};
                        },
                        function(error){
                            console.log(error);
                        }
                    );
                }
                else{
                    alert("Las contraseñas no coinciden.");
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
                user_name: user.user_name,
                user_id: user._id
            }
        };

        $scope.updateUser = function(){
            var newUser =
            {
                name: $scope.newUser.name,
                lastname: $scope.newUser.lastname,
                user_name: $scope.newUser.user_name
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
                        $('#create-user').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                    },
                    function (error) {
                        alert('Hubo un error al actualizar el usuario. ' +
                            'Por favor intente mas tarde');
                    }
                );
            }
        };


        $scope.deleteUser = function(userId, index){
            var currentUser = SessionService.get("idUser");
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
                alert('No se puede borrar al usuario que esta actualmente' +
                    ' logeado.');
            }

        }
    }

]);