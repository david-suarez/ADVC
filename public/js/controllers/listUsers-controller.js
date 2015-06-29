advcApp.controller('listUsersCtrl', ['$scope', '$routeParams',
    '$location', 'listUsersSrv',
    function($scope, $routeParams, $location, listUsersSrv) {
        $scope.Users = {};
        $scope.newUser = {};
        $scope.showModal = false;

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

        $scope.createUser = function () {
            if($scope.newUser.password === $scope.newUser.confirmPassword){
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
            }else{
                alert("Contraseñas no coinciden")
            }

        };

        $scope.cancelUser=function(){
            $scope.showModal = !$scope.showModal;
            $scope.newUser = {};
        }
    }

]);