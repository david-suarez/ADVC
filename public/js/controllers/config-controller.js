advcApp.controller('configCtrl', ['$scope', '$routeParams',
    '$location','$http',
    function($scope, $routeParams, $location,$http) {
        var config={
            method:"GET",
            url:"/config/config.json"
        }

        var response=$http(config);
        response.success(function(data, status, headers, config) {
            $scope.seguro=data;
        });
        response.error(function(data, status, headers, config) {
            alert("Ha fallado la petición. Estado HTTP:"+status);
        });

    }]);