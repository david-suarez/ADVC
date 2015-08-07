advcApp.controller('changePasswordCtrl', [
    '$scope', 'changePassSrv', 'SessionService',
    function($scope, changePassSrv, SessionService){
        $scope.User = {};
        $scope.password = null;
        $scope.newPass = null;
        $scope.repiteNewPass = null;

        $scope.saveNewPass = function(){
            var user_id = SessionService.get('userId');
            var data = {
                username: SessionService.get('username'),
                password: $scope.password,
                newPass: $scope.newPass,
                repiteNewPass: $scope.repiteNewPass
            };
            if($scope.validateFields()){
                changePassSrv.update({user_id: user_id}, data,
                    function(data) {
                        $.noty.consumeAlert({layout: 'topCenter',
                            type: 'success', dismissQueue: true ,
                            timeout:2000 });
                        alert('El password fue cambiado exitosamente.');
                        $.noty.stopConsumeAlert();
                        $scope.password=null;
                        $scope.newPass=null;
                        $scope.repiteNewPass=null;
                    },
                    function(error){
                        console.log(error);
                    }
                )}
        };

        $scope.validateFields = function () {
            var pass = $scope.password;
            var newPass = $scope.newPass;
            var repiteNewPass = $scope.repiteNewPass;
            var newPassRegEx = /(?!^[0-9]*$)(?!^[a-zA-Z]*$)^([a-zA-Z0-9]{5,20})/;

            if (!pass) {
                $scope.isPassValid = false;
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese la contrasena actual.');
                $.noty.stopConsumeAlert();
                //alert('Ingrese la contrasena actual')
                return false;
            }
            if (newPass === repiteNewPass){
                if (newPass !== pass){
                    if (!newPassRegEx.test(newPass))
                    {
                        $scope.isNewPassValid = false;
                        $.noty.consumeAlert({layout: 'topCenter',
                            type: 'warning', dismissQueue: true ,
                            timeout:2000 });
                        alert('La contraseña tiensdakjah.');
                        $.noty.stopConsumeAlert();
                        return false;
                    }
                }else{
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('La nueva contrasenia debe seri diferente.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            } else {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Las contraseñas no coinciden.');
                $.noty.stopConsumeAlert();
                $scope.isRepiteNewPassValid = false;
                return false;
            }
            $scope.isPassValid = true;
            $scope.isNewPassValid = true;
            $scope.isRepiteNewPassValid = true;
            return true;
        };

        $scope.clean = function(){
            $scope.password=null;
            $scope.newPass=null;
            $scope.repiteNewPass=null;
        }
    }
]);
