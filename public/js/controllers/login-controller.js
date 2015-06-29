advcApp.controller('loginCtrl', ['$scope', '$location', 'loginService',
    function($scope, $location, loginService){
    $scope.User = {};
    $scope.loginSystem = function(){
        //console.log($scope.User);
        var resp = loginService.entrySystem($scope.User).then(function(response){
            if(response.success){
                $location.path('/index');
            };
        });
    };
}]);