advcApp.controller('loginCtrl', function($scope, $location, loginService){
    $scope.UserLogin = {};
    $scope.loginSystem = function(res){
        if(res.success){
            var resp = loginService.entrySystem($scope.UserLogin).then(function(response){
                if(response.success){
                    console.log(response);
                };
            });
        };
    };
});