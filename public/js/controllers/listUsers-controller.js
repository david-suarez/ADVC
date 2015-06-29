advcApp.controller('listUsersCtrl', ['$scope', '$http', '$routeParams', '$location', 'listUsersSrv',

    function($scope, $http, $routeParams, $location, listUsersSrv) {
        $scope.Users = {};
        $scope.newUser = {};
        $scope.showModal = false;
        $http.get('/api/v0.1/users').success(function(datos){
            $scope.Users= datos;
            //console.log(datos);
            }).error(function(datos){
            console.log("Ocurrio un error en el servidor"+datos);
            });
        $scope.formCreateUser = function () {
            $scope.showModal = !$scope.showModal;
        },
        $scope.createUser = function () {
            //console.log($scope.newUser.password);
            if($scope.newUser.password==$scope.newUser.confirmPassword){
                listUsersSrv.createUser($scope.newUser).then(function (response) {
                    //console.log(response);
                    $scope.showModal = !$scope.showModal;
                    $scope.newUser = {};
                    //$location.path("/listUser");

                });
            }else{
                alert("Contraseñas no coinciden")
            }

        },
        $scope.cancelUser=function(){
            $scope.showModal = !$scope.showModal;
            $scope.newUser = {};
        }
    }

]);