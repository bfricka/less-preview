l2c.controller('Less2CssCtrl', [
    '$http'
  , '$scope'
  , 'Stor'
  , 'LessCompiler'

  , function($http, $scope, Stor, LessCompiler) {
    // Start req for options
    var getOptions = $http.get('/less-options'); // @todo Create service
    var LessCache = new Stor('LessCache');

    // Set model
    getOptions.success(function(options) {
      setOptions(options);
      setLessOptions(options);
      $scope.$emit('optionsLoaded');
      $scope.updateOptions();
      loadLess();
    });

    // Setup watchers
    getOptions.success(function() {
      $scope.$watch('lessInput', function(val) {
        LessCache.set(val);
        compileLess();
      });

      $scope.$watch('lessOptions', function() {
        compileLess();
      }, true);

      $scope.$watch('lessOptions.lessVersion', function() {
        loadLess();
      });
    });

    // Set defaults
    // @todo Work this value getter into directive or JSON.
    // Boo on DOM query even if it's only initial
    $scope.lessInput = LessCache.get() || $('#less-input').val();
    $scope.cssOutput = '';
    $scope.rootpath = '';
    $scope.loading = false;
    $scope.legacyUnits = false;
    $scope.compileError = false;

    $scope.updateOptions = function() {
      var lessOpts = $scope.lessOptions;

      lessOpts.dumpLineNumbers = $scope.lineNumbersEnabled ? $scope.dumpLineNumbers : false;
      lessOpts.rootpath = $scope.rootPathEnabled ? $scope.rootpath : '';
      $scope.legacyUnits = !$scope.isLegacy() && $scope.legacyUnits ? true : false;
      lessOpts.strictMaths = lessOpts.strictUnits = $scope.legacyUnits ? false : true;
      LessCompiler.updateOptions(lessOpts);
    };

    $scope.toggleModel = function(model) {
      $scope[model] = !$scope[model];
      $scope.updateOptions();
    };

    $scope.toggleTxt = function(model) {
      return $scope[model] ? 'Enabled' : 'Disabled';
    };

    $scope.toggleDrawer = function(ev) {
      ev.preventDefault();
      $scope.drawerOpen = !$scope.drawerOpen;
    };

    $scope.isLegacy = function() {
      // Oh shit, hard-coded numbers!
      return $scope.lessOptions
        ? parseFloat($scope.lessOptions.lessVersion, 10) < 1.4
        : false;
    };

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

    function setOptions(opts) {
      for (var k in opts) {
        $scope[k] = opts[k];
      }
    }

    function setLessOptions(opts) {
      _.each(opts.lessVersions, function(version) {
        if (version.type === 'current')
          $scope.lessOptions.lessVersion = version.number;

        if (version.type === 'pre')
          $scope.lessOptions.preRelease = version.number;
      });

      $scope.dumpLineNumbers = (function() {
        var sel = _.find(opts.lineNumberOptions, function(opt) {
          return !!opt["default"];
        });

        return sel.value;
      })();
    }
  }
]);
