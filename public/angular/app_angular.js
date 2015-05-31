/**
 * Created by Baby_Moico on 30/05/2015.
 */
var Asociacion = angular.module('APPASOC',[]); // Se declara la aplicacion angular

Asociacion.controller('controladorPrincipal', function($scope, $http){
    /*var texto={};
    texto.mensaje ='CONTROLADOR';
    $scope.modelo = texto;*/

    $scope.users = {};
    $scope.user = {};

    $http.get('/api/v0.1/users').success(function(datos){
        $scope.users = datos;
        console.log ($scope.users);

    }).error(function(datos){
        console.log("Ocurrio un error en el servidor" + datos);

    });

    $scope.crearUsuario = function(){
      console.log($scope.user) ;
      $http.post('/api/v0.1/users', {user: $scope.user}).success(function(datos){
        console.log(datos);
        $scope.user = {};
        $scope.users.push(datos);
    }).error(function(datos){
        console.log("Error al guardar los datos" +datos);
    });
    }

    $scope.eliminarUsuario = function(id){
        //console.log("eliminando" + id);
        $http.delete('/api/v0.1/users/'+ id).success(function(user) {
            var removeIndex = null;
            for(var index=0; index < $scope.users.length; index++){
                if($scope.users[index]._id === user.user_id){
                    removeIndex = index;
                }
            }
            $scope.users.splice(removeIndex, 1);
    }).error(function(datos){
        console.log("Error al borrar los datos" +datos);
    });
    }
});
