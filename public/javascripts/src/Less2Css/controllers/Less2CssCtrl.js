angular
.module('Less2Css')
.controller('Less2CssCtrl', [
  '$scope',
  'LessLoader',
  'LessOptions',
  'LessCompiler',
  function($scope, LessLoader, LessOptions, LessCompiler) {
    var _opts;
    // Start req for options
    LessOptions.request.then(setupOptions);

    function setupOptions() {
      _opts = $scope.opts = LessOptions.options;
      updateOptions(_opts);

      // Setup watchers
      $scope.$watch('lessInput', compileLess);
      $scope.$watch('opts.selectedVersion', loadLess);
      $scope.$watch('opts', updateOptions, true);
    }

    // Set defaults
    _.extend($scope,  {
      lessInput: LessCompiler.getCache(),
      cssOutput: '',
      loading: false,
      compileError: false
    });

    function updateOptions(opts) {
      LessCompiler.updateOptions(opts);
      LessOptions.setCache(opts);
      compileLess();
    }

    // Private fns
    function loadLess() {
      $scope.loading = true;

      LessLoader
        .load(_opts.selectedVersion, _opts.version.type === 'pre')
        .then(function() {
          LessCompiler.initLess();
          compileLess();
          $scope.loading = false;
        });
    }

    function compileLess() {
      $scope.$safeApply(function() {
        _.extend($scope, {
          cssOutput: LessCompiler.compileLess($scope.lessInput),
          compileError: LessCompiler.error
        });
      });
    }
  }
]);