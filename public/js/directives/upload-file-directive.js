
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

advcApp.directive('errSrc', function() {
    return {
        link: function(scope, element, attrs) {
            element.bind('error', function() {
                if (attrs.src != attrs.errSrc) {
                    attrs.$set('src', attrs.errSrc);
                }
            });
        }
    }
});

advcApp.directive('dynamicTooltip', function($compile) {
    return {
        restrict: 'A',
        scope: {
            tooltipElement: '=',
            dynamicTooltip: '@'
        },
        link: function(scope, element, attrs) {
            var template = '<a href="#" tooltip-placement="top" tooltip="' + scope.dynamicTooltip + '">{{tooltipElement}}</a>';
            scope.$watch('tooltipElement', function(value) {
                var previousTooltip = element.find('a');
                angular.forEach(previousTooltip, function(item,i){
                    var el = angular.element(item);
                    el.replaceWith(el.text());
                });
                var searchText = scope.tooltipElement;
                if (searchText) {
                    replaced = element.html().replace(new RegExp(searchText, "g"), template);
                    element.html(replaced);
                }
                $compile(element.contents())(scope);
            });
        }
    }
});