advcApp.controller('listClubsCtrl', ['$scope', '$routeParams',
    '$location', 'listClubsSrv','listUsersSrv',
    function($scope, $routeParams, $location, listClubsSrv, listUsersSrv) {
        $scope.Clubs = {};
        $scope.newClub = {};
        $scope.showModal = false;
        $scope.showModal2 = false;
        $scope.Users = {};
        $scope.editClub = {};

        listUsersSrv.get({},
            function(result){
                for(var index in result.data){
                    var user = result.data[index];
                    var fullName = user.name + ' ' + user.lastname
                    result.data[index].fullName = fullName;
                }
                $scope.Users = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        listClubsSrv.get({},
            function(result){
                $scope.Clubs = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        $scope.createClub= function () {


            var newClub = {
                name: $scope.newClub.name,
                foundation: $scope.newClub.foundation,
                delegate: $scope.newClub.delegate._id
            };

             listClubsSrv.save({club: newClub},
             function (data) {
             $scope.Clubs.push(data);
             $scope.showModal = !$scope.showModal;
             $scope.newClub = {};
             },
             function(error){
             console.log(error);
             }
             );
        };
        $scope.formCreateClub = function () {
            $scope.showModal = !$scope.showModal;
        };
        $scope.formEditClub = function (club) {
            $scope.showModal2 = !$scope.showModal2;
            $scope.editClub.name = club.name;
            $scope.editClub.foundation = new Date(club.foundation);
            $scope.editClub.delegate= club.delegate;
            console.log($scope.editClub.delegate);
        };

        $scope.closeModal=function(){
            //$scope.showModal = !$scope.showModal;
            //$scope.showModal2 = !$scope.showModal2;
            $scope.newClub = {};
            //restartValidationFields();
        }




    }
]);
