l2c.controller('Less2CssCtrl', [
    '$http'
  , '$scope'
  , 'LessCompiler'
  , 'LessOptions'

  , function($http, $scope, LessCompiler, LessOptions) {
    // Start req for options
    LessOptions.request.then(setupOptions);

    function setupOptions() {
      $scope.opts = LessOptions.options;
      updateOptions($scope.opts);

      // Setup watchers
      $scope.$watch('lessInput', compileLess);
      $scope.$watch('opts.selectedVersion', loadLess);
      $scope.$watch('opts', updateOptions, true);
    }


    // Set defaults
    $scope.lessInput = LessCompiler.getCache();
    $scope.cssOutput = '';
    $scope.loading = false;
    $scope.compileError = false;

    function updateOptions(opts) {
      LessCompiler.updateOptions(opts);
      LessOptions.setCache(opts);
      compileLess();
    }

    // Private fns
    function loadLess() {
      $scope.loading = true;
      var loading = LessCompiler.loadLess();

      loading.done(function() {
        $scope.$apply(function() {
          LessCompiler.initLess();
          compileLess();
          $scope.loading = false;
        });
      });
    }

    function compileLess() {
      $scope.cssOutput = LessCompiler.compileLess($scope.lessInput);
      $scope.compileError = LessCompiler.error;
      $scope.safeApply();
    }
  }
]);