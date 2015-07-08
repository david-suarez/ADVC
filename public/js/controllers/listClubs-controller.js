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

        var restartValidationFields = function(){
            $scope.isNameValid = true;
        };

        restartValidationFields();

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

        $scope.validateFields = function () {
            var name = $scope.newClub.name;
            var nameRegEx = /[A-Za-z0-9_]{3,16}/;

            if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;}
            else {
                $scope.isPassValid = true;
                return true;
            }
        };


        $scope.createClub= function () {


            var newClub = {
                name: $scope.newClub.name,
                foundation: $scope.newClub.foundation,
                delegate: $scope.newClub.delegate._id
            };

            if($scope.validateFields()){

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
            }else{
                console.log("Las contraseñas no coinciden.");
            }
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

        $scope.formDeleteClub = function (club) {
            var r = confirm("Esta seguro de eliminar el club" +' '+ club.name);
            console.log(club._id);
            if (r == true) {
                x = "You pressed OK!";
                listClubsSrv.delete({clubId: club._id},
                    function (data) {
                        var index = 0;
                        $scope.Clubs.splice(index, 1);
                        //$scope.Clubs.splash(data);
                    }
                );
            } else {
                x = "You pressed Cancel!";
            }

            /*$scope.showModal = !$scope.showModal;
            $scope.createMode = true;
            $scope.editMode = false;*/
        };


        $scope.closeModal=function(){
            $scope.showModal = !$scope.showModal;
            $scope.newClub = {};
            //restartValidationFields();
        }




    }
]);
