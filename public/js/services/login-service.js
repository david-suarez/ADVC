advcApp.service('loginService', ['$q', '$http', function($q, $http){
    return{
        isUserAuthenticated: false,
        getUserAthenticated: function(){
            return this.isUserAuthenticated;
        },
        entrySystem : function(user){
            var dfd = $q.defer();
            $http.post('/login', user).success(function(response){
                //console.log(response);
                dfd.resolve(response);
                this.isUserAuthenticated = true;
            });
            return dfd.promise;
        }
    };
}]);