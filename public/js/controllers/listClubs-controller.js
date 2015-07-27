advcApp.controller('listClubsCtrl', ['$scope', '$routeParams',
    '$location', 'listClubsSrv','listUsersSrv', 'SessionService',
    function($scope, $routeParams, $location, listClubsSrv, listUsersSrv,
             SessionService) {
        $scope.Clubs = {};
        $scope.newClub = {};
        $scope.formName = '';
        $scope.createMode = false;
        $scope.editMode = false;
        $scope.Users = {};
        $scope.editClub = {};
        $scope.showModal = false;
        $scope.Division = {};
        $scope.today = new Date();
        $scope.format = 'dd/MM/yyyy';
        var userRole = SessionService.get('userRole');
        var userId = SessionService.get('userId');
        var filterclub = {};

        var restartValidationFields = function(){
            $scope.isNameValid = true;
        };

        restartValidationFields();

        listUsersSrv.get({role: 'Delegado'},
            function(result){
                for(var index in result.data){
                    var user = result.data[index];
                    var fullName = user.name + ' ' + user.lastname;
                    result.data[index].fullName = fullName;
                }
                $scope.Users = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        if(userRole === 'Delegado') {
            filterclub = {delegate: userId}
        }
        listClubsSrv.get(filterclub,
            function(result){
               $scope.Clubs = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        $scope.validateFields = function () {
            var name = $scope.newClub.name;
            var foundation = $scope.newClub.foundation;
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            if (!name || !name.trim()) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese un nombre para el club que desea crear.');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            }
            if(foundation){
                var now = new Date();
                var dateFound = new Date(foundation);
                if(dateFound > now){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('Ingrese una fecha de creación valida.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            }
            return true;
        };

        $scope.createClub= function () {
            var newClub = {
                name: $scope.newClub.name,
                foundation: $scope.newClub.foundation,
                delegate: $scope.newClub.delegate ?
                    $scope.newClub.delegate. _id : null
            };
            if($scope.validateFields()){
                listClubsSrv.save({club: newClub},
                    function (data) {
                        var delegateId = data.delegate;
                        var index = 0;
                        for(index; index < $scope.Users.length; index++){
                            if($scope.Users[index]._id === delegateId){
                                data.delegate = $scope.Users[index];
                                break;
                            }
                        }
                        $scope.Clubs.push(data);
                        $('#create-club').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                        $scope.newClub = {};
                    },
                    function(error){
                        console.log(error);
                    }
                );
            }
        };

        $scope.formCreateClub = function () {
            $scope.createMode = true;
            $scope.editMode = false;
            $scope.formName = 'Formulario de creación de clubs';
        };

        $scope.formEditClub = function (club) {
            $scope.createMode = false;
            $scope.editMode = true;
            $scope.formName = 'Formulario de edición de clubs';
            $scope.newClub.name = club.name;
            $scope.newClub.foundation = new Date(club.foundation);
            var index = 0;
            if(club.delegate){
                for(index; index < $scope.Users.length; index++){
                    if($scope.Users[index]._id === club.delegate._id){
                        $scope.newClub.delegate = $scope.Users[index] ;
                        break;
                    }
                }
            }
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
                name: $scope.newClub.name,
                foundation: $scope.newClub.foundation,
                delegate: $scope.newClub.delegate ?
                    $scope.newClub.delegate. _id : null
            };
            if($scope.validateFields()) {
                listClubsSrv.update({clubId: $scope.newClub._id},
                    {newDataClub: newClub},
                    function (data) {
                        $scope.showModal = !$scope.showModal;
                        $scope.newClub = {};
                        var index = 0;
                        for (index; index < $scope.Clubs.length; index++) {
                            if ($scope.Clubs[index]._id === data._id) {
                                var option = self
                                    .findUserSelected(data.delegate);
                                if (option != -1)
                                    data.delegate = $scope.Users[option];
                                $scope.Clubs[index] = data;
                            }
                        }
                        $('#create-club').modal('hide'); //hide modal
                        $('body').removeClass('modal-open');
                        $('.modal-backdrop').remove();
                    },
                    function (error) {
                        console.log(error);
                    }
                );
            }
        };

        $scope.formDeleteClub = function (club, index) {
            var r = confirm("Esta seguro de eliminar el club" +' '+ club.name);
            if (r == true) {
                listClubsSrv.delete({clubId: club._id},
                    function (data) {
                        $scope.Clubs.splice(index, 1);
                    }
                );
            }
        };

        $scope.closeModal=function(){
            $scope.showModal = !$scope.showModal;
            $scope.newClub = {};
            restartValidationFields();
        };

        $scope.obtainFormatDate = function(date){
            if(date) {
                var foundDate = new Date(date);
                return foundDate.toLocaleDateString();
            }
            return '';
        };

        $scope.formTeams = function(club){
            var path = '/listClubs/' + club.name +'/'+ club._id + '/listTeams';
            $location.path(path);
        };

        $scope.toggleMin = function() {
            $scope.minDate = $scope.minDate ? null : new Date();
        };
        $scope.toggleMin();

        $scope.dateOptions = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
            return ( mode === 'day' &&
            ( date.getDay() === 0 || date.getDay() === 6 ) );
        };

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };
    }
]);
