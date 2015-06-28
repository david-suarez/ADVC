advcApp.controller('loginCtrl', ['$scope', '$location', 'loginService', '$rootScope',
    function($scope, $location, loginService,$rootScope){
    $scope.User = {};
    $scope.loginSystem = function(){
        //console.log($scope.User);
        var resp = loginService.entrySystem($scope.User).then(function(response){
            if(response.success){
                $location.path('/index');
            }
            else
            {
            };
        });
    };

}]);
