advcApp.controller('loginCtrl', [
    '$scope', '$location', '$rootScope', 'loginService', 'SessionService',
    '$window',
    function($scope, $location, $rootScope, loginService, SessionService,
             $window){
        $scope.User = {};
        $scope.isAnyError = false;
        $scope.loginSystem = function(){
            loginService.save($scope.User,
                function(response){
                    if(response.success){
                        var user = response.user;
                        SessionService.set('logged', true);
                        SessionService.set(
                            'user', user.fullName);
                        SessionService.set('userId', user._id);
                        SessionService.set('userRole', user.role);
                        $rootScope.$emit('userAuthenticated', true);
                        $window.location.reload();
                        $location.path('/mainBoard');
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
                        username: '',
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
