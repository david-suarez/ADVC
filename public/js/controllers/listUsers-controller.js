advcApp.controller('listUsersCtrl', ['$scope', '$routeParams',
    '$location', 'listUsersSrv',
    function($scope, $routeParams, $location, listUsersSrv) {
        $scope.Users = {};
        $scope.newUser = {};
        $scope.showModal = false;
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
        };

        $scope.validateFields = function () {
            var name = $scope.newUser.name;
            var lastName = $scope.newUser.lastname;
            var userName = $scope.newUser.user_name;
            var pass = $scope.newUser.password;
            var passRegEx = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{8,10})/;
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
                            $scope.showModal = !$scope.showModal;
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
        }
    }

]);