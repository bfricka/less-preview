l2c.controller('OptionsCtrl', [
  '$scope', 'LessOptions'
  , function($scope, LessOptions) {
    var opts = $scope.opts = LessOptions.options;

    LessOptions.request.then(setupOptions);

    function setupOptions() {
      // Copy defaults to opts
      _.defaults(opts, opts.options);
      opts.lineNumbers = opts.lineNumbers || opts.lineNumberOptions[0].value;
      setupVersion();
    }

    function setupVersion() {
      // Select current version
      opts.selectedVersion = opts.selectedVersion || _.find(opts.versions, function (version) {
        return version.type === 'current';
      }).number;
    }

    function updateLineNumbers() {
      opts.dumpLineNumbers = opts.lineNumbersEnabled && opts.lineNumbers ? opts.lineNumbers : false;
    }

    function updateRootPath() {
      opts.rootpath = opts.rootPathEnabled && opts.rootpathText ? opts.rootpathText : false;
    }

    function updateVersion(version) {
      opts.version = _.find(opts.versions, function(ver) { return ver.number === version; });
    }

    $scope.toggleOption = function(model) {
      opts[model] = !opts[model];
    };

    $scope.toggleTxt = function(model) {
      return opts[model] ? 'Enabled' : 'Disabled';
    };

    $scope.$watch('opts.lineNumbers+opts.lineNumbersEnabled', updateLineNumbers);
    $scope.$watch('opts.rootpathText+opts.rootpath', updateRootPath);
    $scope.$watch('opts.selectedVersion', updateVersion);
  }
]);
