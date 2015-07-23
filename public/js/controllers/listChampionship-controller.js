advcApp.controller('listChampionshipCtrl', ['$scope', '$routeParams',
    '$location', 'listChampionshipSrv',
    function($scope, $routeParams, $location, listChampionshipSrv) {
        $scope.Championships = {};
        $scope.today = new Date();
        $scope.format = 'dd/MM/yyyy';
        $scope.createMode = false;
        $scope.editMode = false;
        $scope.isNameValid = true;
        $scope.opened1 = false;
        $scope.opened2 = false;
        $scope.opened3 = false;
        $scope.opened4 = false;
        $scope.newChampionship = {};

        listChampionshipSrv.get({},
            function(result){
                $scope.Championships = result.data;
            },
            function(error){
                console.log(error);
            }
        );

        var restartValidationFields = function(){
            $scope.isNameValid = true;
        };

        restartValidationFields();

        $scope.validateFields = function () {
            var name = $scope.newChampionship.name;
            var initialDate = $scope.newChampionship.initial_date;
            var final_date = $scope.newChampionship.final_date;
            var initial_inscription_date = $scope.newChampionship.initial_inscription_date;
            var final_inscription_date = $scope.newChampionship.final_inscription_date;
            var now = new Date();
            var now_Year = now.getFullYear();
            var nameRegEx = /^([a-z ñáéíóú]{2,60})$/i;
            if (!name || !name.trim()) {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese un nombre para el campeonato que desea crear.');
                $.noty.stopConsumeAlert();
                return false;
            }else if (!nameRegEx.test(name)) {
                $scope.isNameValid = false;
                return false;
            }
            if(initialDate && final_date){
                var ini_Date_Year = initialDate.getFullYear();
                var ini_Date_Year = initialDate.getFullYear();

                if(ini_Date_Year != now_Year){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('ingrese una fecha correspondiente a este anio.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
                if(initialDate > final_date){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('ingrese una fecha de creación valida.');
                    $.noty.stopConsumeAlert();
                    return false;
                }

            } else{
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese fecha de inicio y/o fin para el campeonato que desea crear.');
                $.noty.stopConsumeAlert();
                return false;
            }

            if(initial_inscription_date && final_inscription_date){
                var initial_Inc_Date_Year = initial_inscription_date.getFullYear();
                var final_Inc_Date_Year = final_inscription_date.getFullYear();

                if(initial_inscription_date > final_inscription_date){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('ingrese una fecha de creación valida.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
                if(initial_inscription_date > initialDate){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('ingrese una fecha de creación valida.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
                if(initial_Inc_Date_Year != now_Year){
                    $.noty.consumeAlert({layout: 'topCenter',
                        type: 'warning', dismissQueue: true ,
                        timeout:2000 });
                    alert('ingrese una fecha correspondiente a este anio.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
                if(final_Inc_Date_Year != now_Year){
                    $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                    alert('ingrese una fecha correspondiente a este anio.');
                    $.noty.stopConsumeAlert();
                    return false;
                    }
                if(final_inscription_date > initialDate){
                    $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                    alert('ingrese una fecha de creación valida.');
                    $.noty.stopConsumeAlert();
                    return false;
                }
            } else {
                $.noty.consumeAlert({layout: 'topCenter',
                    type: 'warning', dismissQueue: true ,
                    timeout:2000 });
                alert('Ingrese fecha inicio y/o fin de inscripción para el coampeonato que desea crear.');
                $.noty.stopConsumeAlert();
                return false;
            }
            return true;
        };

        $scope.formCreateChampionship = function () {
            $scope.createMode = true;
            $scope.editMode = false;
        };

        $scope.createChampionship= function () {
            var newChampionship = {
                name: $scope.newChampionship.name,
                initial_date: $scope.newChampionship.initial_date,
                final_date: $scope.newChampionship.final_date,
                initial_inscription_date: $scope.newChampionship.initial_inscription_date,
                final_inscription_date: $scope.newChampionship.final_inscription_date

            };
            if($scope.validateFields()){
                listChampionshipSrv.save({championship: newChampionship},
                        function (data) {
                            $scope.Championships.push(data);
                            $('#create-championship').modal('hide'); //hide modal
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                            $scope.Championships = {};
                        },
                        function(error){
                            console.log(error);
                        }
                    );
            }
        };

        $scope.formEditChampionship = function (championship) {
            $scope.createMode = false;
            $scope.editMode = true;
            $scope.newChampionship.name = championship.name;
            $scope.newChampionship.initial_date = new Date(championship.initial_date);
            $scope.newChampionship.final_date = new Date(championship.final_date);
            $scope.newChampionship.initial_inscription_date = new Date(championship.initial_inscription_date);
            $scope.newChampionship.final_inscription_date = new Date(championship.final_inscription_date);
            $scope.newChampionship._id = championship._id;
        };

        $scope.editChampionship= function () {
            var self = this;
            var newChampionship = {
                championshipId: $scope.newChampionship._id,
                name: $scope.newChampionship.name,
                initial_date: $scope.newChampionship.initial_date,
                final_date: $scope.newChampionship.final_date,
                initial_inscription_date: $scope.newChampionship.initial_inscription_date,
                final_inscription_date: $scope.newChampionship.final_inscription_date
            };
            if($scope.validateFields()) {
                listChampionshipSrv.update({championshipId: $scope.newChampionship._id},
                        {championship: newChampionship},
                        function (data) {
                            $scope.showModal = !$scope.showModal;
                            $scope.newChampionship = {};
                            var index = 0;
                            for (index; index < $scope.Championships.length; index++) {
                                if ($scope.Championships[index]._id === data._id) {
                                    $scope.Championships[index] = data;
                                }
                            }
                            $('#create-championship').modal('hide'); //hide modal
                            $('body').removeClass('modal-open');
                            $('.modal-backdrop').remove();
                        },
                        function (error) {
                            console.log(error);
                        }
                    );
            }
        };

        $scope.formDeleteChampionship = function (championship, index) {
            var r = confirm("Esta seguro de eliminar el campeonato" +' '+ championship.name);
            if (r == true) {
                listChampionshipSrv.delete({championshipId: championship._id},
                    function (data) {
                        $scope.Championships.splice(index, 1);
                    }
                );
            }
        };


        $scope.obtainFormatDate = function(date){
            if(date) {
                var foundDate = new Date(date);
                return foundDate.toLocaleDateString();
            }
            return '';
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

        $scope.open = function($event,num) {
            console.log($event,num);
            $event.preventDefault();
            $event.stopPropagation();
            if(num==1){
                $scope.opened1 = true;
                $scope.opened2 = false;
                $scope.opened3 = false;
                $scope.opened4 = false;
            }else if(num==2){
                $scope.opened2 = true;
                $scope.opened1 = false;
                $scope.opened3 = false;
                $scope.opened4 = false;
            }else if(num==3){
                $scope.opened3 = true;
                $scope.opened1 = false;
                $scope.opened2 = false;
                $scope.opened4 = false;
            }else if(num==4){
                $scope.opened4 = true;
                $scope.opened1 = false;
                $scope.opened2 = false;
                $scope.opened3 = false;
            }

        };
}]);
