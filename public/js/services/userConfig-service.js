advcApp.service('userConfigSrv', function($q,$http) {
    return {
        createUser : function(user){
            var dfd = $q.defer();
            var newUser = {
                user: user
            };
            $http.post('/api/v0.1/users', newUser).success(function(response){
                dfd.resolve(response);
            });
            return dfd.promise;

        }

    };

});

