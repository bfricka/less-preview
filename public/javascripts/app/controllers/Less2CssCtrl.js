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

      $scope.$watch('lessOptions', compileLess, true);
      $scope.$watch('lessOptions.lessVersion', loadLess);
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

    // B I G
    // F U C K I N G
    // T O D O !
    //
    // R E - W R I T E
    // T H I S
    // W H O L E
    // F U C K I N G
    // T H I N G
    //
    // U S E
    // DATA.MODEL
    // OR A
    // F U C K I N G
    // S E R V I C E
    //
    // S I N C E
    // Y O U R
    // S C O P E S
    // A R E
    // S O
    // R E T A R D E D!
    //
    // D O N ' T
    // U S E
    // NG-CHANGE
    // USE A
    // W A T C H E R!
    //
    // T U R N
    // T H I S
    // W H O L E
    // T H I N G
    // I N T O
    // A PROPER
    // D I R E C T I V E
    // C O N T R O L L E R
    // A N D
    // A N
    // O P T I O N S
    // C O N T R O L L E R
    // A N D
    // S H A R E
    // T H E
    // D A T A
    // P R O P E R L Y!!


    function updateOptions() {
      var opts = $scope.options;
    }

    $scope.updateOptions = function() {
      var lessOpts = $scope.options;

      lessOpts.dumpLineNumbers = $scope.lineNumbersEnabled ? $scope.dumpLineNumbers : false;
      lessOpts.rootpath = $scope.rootPathEnabled ? this.rootpath : '';
      $scope.legacyUnits = !$scope.isLegacy() && $scope.legacyUnits ? true : false;
      lessOpts.strictMath = lessOpts.strictUnits = $scope.legacyUnits;
      LessCompiler.updateOptions(lessOpts);
    };

    $scope.isLegacy = function() {
      // Oh shit, hard-coded numbers!
      return $scope.options
        ? parseFloat($scope.options.lessVersion, 10) < 1.4
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
      _.each(opts.versions, function(version) {
        if (version.type === 'current')
          $scope.options.lessVersion = version.number;

        if (version.type === 'pre')
          $scope.options.preRelease = version.number;
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
