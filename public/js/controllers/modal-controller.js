advcApp.controller('ModalCtrl', [ '$scope', '$modalInstance',
    function ($scope, $modalInstance) {
        var modal = this;
        modal.formPlayerName = 'Formulario de creación de jugadores';
        modal.steps = [
            {
                name: 'Información personal',
                indicator: 'one'
            },
            {
                name: 'Lugar y partida de nacimiento',
                indicator: 'two'
            },
            {
                name: 'Dirección',
                indicator: 'three'
            }
        ];
        modal.step = 0;

        modal.isFirstStep = function () {
            return modal.step === 0;
        };

        modal.isLastStep = function () {
            return modal.step === (modal.steps.length - 1);
        };

        modal.isCurrentStep = function (step) {
            return modal.step === step;
        };

        modal.setCurrentStep = function (step) {
            modal.step = step;
        };

        modal.getCurrentStep = function () {
            return modal.steps[modal.step].indicator;
        };

        modal.getNextLabel = function () {
            return (modal.isLastStep()) ? 'Guardar' : 'Siguente';
        };

        modal.handlePrevious = function () {
            modal.step -= (modal.isFirstStep()) ? 0 : 1;
        };

        modal.handleNext = function () {
            if (modal.isLastStep()) {
                $modalInstance.close(modal.wizard);
            } else {
                modal.step += 1;
            }
        };

        modal.dismiss = function(reason) {
            $modalInstance.dismiss(reason);
        };

        /*
         shows the browser for select image
         @todo move this to directive
         */

        modal.doClick = function() {
            $("#fileElement").click();
        };

        $scope.fileIsValid = function(){
            return true;
        }
    }
]);