advcApp.service('loginService', ['$q', '$http', function($q, $http){
    return{
        entrySystem : function(user){
            var dfd = $q.defer();
            $http.post('/login', user).success(function(response){
                dfd.resolve(response);
            });
            return dfd.promise;
        }
    };
}]);