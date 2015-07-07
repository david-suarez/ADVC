advcApp.controller('listClubsCtrl', ['$scope', '$routeParams',
    '$location', 'listClubsSrv','listUsersSrv',
    function($scope, $routeParams, $location, listClubsSrv, listUsersSrv) {
        $scope.Clubs = {};
        $scope.newClub = {};
        //$scope.showModal = false;
        //$scope.showModal2 = false;
        $scope.createMode = false;
        $scope.editMode = false;
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
             $scope.Users.push(data);
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
            $scope.createMode = true;
            $scope.editMode = false;
        };
        $scope.formEditClub = function (club) {
            $scope.showModal = !$scope.showModal;
            $scope.createMode = false;
            $scope.editMode = true;
            $scope.newClub.name = club.name;
            $scope.newClub.foundation = new Date(club.foundation);
            var index = 0;
            for(index; index < $scope.Users.length; index++){
                if($scope.Users[index]._id === club.delegate._id){
                   break;
                };
            }

            $scope.newClub.delegate = $scope.Users[index] ;
            $scope.newClub._id = club._id;
        };

        $scope.findUserSelected = function(delegateId){
            var response = -1;
            for(var index = 0; index < $scope.Users.length; index ++){
                if($scope.Users[index]._id === delegateId){
                    response = index;
                }
            }
            return response;
        };

        $scope.editClub= function () {
            var self = this;
            var newClub = {
                clubId: $scope.newClub._id,
                name: $scope.newClub.name,
                foundation: $scope.newClub.foundation,
                delegate: $scope.newClub.delegate._id
            };



            listClubsSrv.update({clubId: $scope.newClub._id},{newDataClub: newClub},
                function (data) {
                    $scope.showModal = !$scope.showModal;
                    $scope.newClub = {};
                    for(var index = 0; index < $scope.Clubs.length; index++){
                        if($scope.Clubs[index]._id === data._id){
                            var option = self.findUserSelected(data.delegate);
                            if(option != -1)
                                data.delegate = $scope.Users[option];
                            $scope.Clubs[index] = data;
                        }
                    }
                },
                function(error){
                    console.log(error);
                }
            );
        }

        $scope.closeModal=function(){
            $scope.showModal = !$scope.showModal;
            $scope.newClub = {};
            //restartValidationFields();
        }




    }
]);
