
advcApp.directive('uploadFile', function() {
    return {
        restrict: 'AE',
        link: function(scope, element) {
            return element.bind("change", function(changeEvent) {
                var files, image;
                if ($("#fileElement").val() !== "") {
                    if (changeEvent.target && scope.fileIsValid(changeEvent.target.files[0])) {
                        if (changeEvent.target && changeEvent.target.files) {
                            files = element.prop("files");
                            scope.$apply(scope.file = [files][0]);
                            image = window.URL.createObjectURL(changeEvent.target.files[0]);
                            return $("#newFile").attr("src", image);
                        }
                    }
                }
            });
        }
    };
});
