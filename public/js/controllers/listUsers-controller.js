advcApp.controller('listUsersCtrl', ['$scope', '$routeParams',
    '$location', 'listUsersSrv', 'SessionService',
    function($scope, $routeParams, $location, listUsersSrv, SessionService) {
        $scope.Users = {};
        $scope.newUser = {};
        $scope.idUser = {};
        $scope.showModal = false;
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
            $scope.showModal = !$scope.showModal;
            $scope.createMode = true;
            $scope.editMode = false;
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
            var name = $scope.newUser.name;
            var lastName = $scope.newUser.lastname;
            var userName = $scope.newUser.user_name;
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
            $scope.showModal = !$scope.showModal;
            $scope.newUser = {};
            restartValidationFields();
        };

        $scope.editUser = function(user){
            $scope.showModal = !$scope.showModal;
            $scope.createMode = false;
            $scope.editMode = true;
            $scope.newUser =
            {
                name: user.name,
                lastname: user.lastname,
                user_name: user.user_name
            }
        };

        $scope.updateUser = function(){
            //var self = this;
            var newUser =
            {
                name: $scope.newUser.name,
                lastname: $scope.newUser.lastname,
                user_name: $scope.newUser.user_name
            };
            var id ={
                user_id: SessionService.get("user_id")
            };
            console.log(id);

            listUsersSrv.update({user_id: id},{newDataUser: newUser},
                function (data) {
                    console.log(data);
                },
                function(error){
                    console.log(error);
                }
            );
        }


        $scope.deleteUser = function(id){
            var user_id = id;
            console.log(user_id);
            var r = confirm("¿Quiere confirmar la eliminacion del usuario?");
            if (r === true) {
                //console.log( "You pressed OK!");
                listUsersSrv.delete({_id: user_id}, function(data){
                    console.log(data);
                },
                function(error){
                    console.log(error);
                }
                );
            } else {
                console.log("You pressed Cancel!");
            }
        }
    }

]);