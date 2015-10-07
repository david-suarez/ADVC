advcApp.controller("kardexPlayerCtrl", ['$scope', '$http', '$routeParams',
    'listPlayersSrv',
    function($scope, $http, $routeParams, listPlayersSrv){
        $scope.isEditing = false;
        $scope.modalIsOpen = false;
        $scope.currentPlayer = {};
        $scope.newPlayerData = {};
        $scope.defaulImage = 'img/default-avatar.png';

        var playerId = $routeParams.playerId;

        listPlayersSrv.get({_id: playerId},
            function(playerResult){
                $scope.currentPlayer = playerResult.data[0];
            },
            function(error){
                console.log(error)
            }
        );

        $scope.getImage = function(image) {
            if (image) {
                return '/uploads/thumbs/' + image;
            } else {
                return $scope.defaulImage;
            }
        };

        $scope.calculateAge = function(dateOfBirth){
            var today = new Date();
            var todayYear = today.getYear();
            var todayMonth = today.getMonth();
            var todayDate = today.getDate();


            var birthDate = new Date(dateOfBirth);

            var date = birthDate.getDate();
            var month = birthDate.getMonth();
            var year = birthDate.getYear();
            var age = (todayYear + 1900) - year;

            if ( todayMonth < (month - 1)){
                age--;
            }
            if (((month - 1) == todayMonth) && (todayDate < date)){
                age--;
            }
            if (age >= 1900){
                age -= 1900;
            }
            return age;
        };

        $scope.dateOfBirthChange = function(){
            var age = $scope.calculateAge($scope.wizard.dateOfBirth);
            if(age > 11){
                $scope.ciRequired = true;
            }else if(age < 4){
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('La fecha de nacimiento es inválida.');
                $.noty.stopConsumeAlert();
            }
            $scope.currentPlayer.age = age;
        };
    }
]);