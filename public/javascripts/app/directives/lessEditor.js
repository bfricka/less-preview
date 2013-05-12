// Inspired by Angular-UI
l2c.directive('lessEditor', function() {
  return {
      restrict: 'A'
    , require: 'ngModel'

    , link: function(scope, elem, attrs, ngModel) {
      function deferCodeMirror() {
        var opts = scope[attrs.opts]
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

      scope.$on('optionsLoaded', deferCodeMirror);
    }
  };
});
