advcApp.service('loginService', function($q, $http){
    return{
        entrySystem : function(user){
            var dfd = $q.defer();
            $http.post('/login', user).success(function(response){
                dfd.resolve(response);
            });
            return dfd.promise;
        }
    };
});