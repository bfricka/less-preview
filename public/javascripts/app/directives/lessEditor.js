angular
.module('Less2Css')
.directive('lessEditor', [
  'LessOptions'

  , function(LessOptions) {
    return {
        restrict: 'A'
      , require: 'ngModel'

      , link: function(scope, elem, attrs, ngModel) {
        scope.opts = LessOptions.options;
        // Parse and render initial viewValue for CodeMirror
        ngModel.$setViewValue(scope.$eval(attrs.ngModel) || elem[0].value);
        ngModel.$render();

        function deferCodeMirror() {
          var opts = scope.opts.lessEditorOptions
            , codeMirror = CodeMirror.fromTextArea(elem[0], opts);

          codeMirror.on('change', onChange(opts.onChange));

          ngModel.$render = function() {
            codeMirror.setValue(ngModel.$viewValue);
          };
        }

        function onChange() {
          return function(instance, changeObj) {
            var newValue = instance.getValue();

            if (newValue !== ngModel.$viewValue) {
              ngModel.$setViewValue(newValue);
              scope.$apply();
            }
          };
        }

        LessOptions.request.then(deferCodeMirror);
      }
    };
  }
]);
