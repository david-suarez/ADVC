advcApp.controller('loginCtrl', [
    '$scope', '$location', '$rootScope', 'loginService', 'SessionService',
    function($scope, $location, $rootScope, loginService, SessionService){
        $scope.User = {};
        $scope.isAnyError = false;
        $scope.loginSystem = function(){
            loginService.save($scope.User,
                function(response){
                    if(response.success){
                        var user = response.user;
                        SessionService.set('logged', true);
                        SessionService.set(
                            'user', user.name + ' ' + user.lastname);
                        SessionService.set('userId', user._id);
                        SessionService.set('clubId', user._id);
                        $rootScope.$emit('userAuthenticated', true);
                        $location.path('/index');
                    }
                    else
                    {
                        alert('El usuario o la contraseña son incorrectos. ' +
                            'Por favor intente de nuevo con credenciales ' +
                            'válidos.');
                    }
                },
                function(error){
                    $scope.isAnyError = true;
                    $scope.status = 'The server is not listening';
                    alert('El usuario o la contraseña son incorrectos. ' +
                        'Por favor intente de nuevo con credenciales ' +
                        'válidos.');
                    $scope.User = {
                        user_name: '',
                        password: ''
                    };
                    $location.path('/login');
                }
            );
        };

        $scope.cancelLogIn = function(){
            $location.path('/index');
        };
    }
]);
