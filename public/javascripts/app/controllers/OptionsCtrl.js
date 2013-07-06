l2c.controller('OptionsCtrl', [
  '$scope', 'LessOptions'
  , function($scope, LessOptions) {
    var opts = $scope.opts = LessOptions.options;

    LessOptions.request.then(setupOptions);

    function setupOptions() {
      var defaults = opts.options;

      opts.lineNumbers = opts.lineNumberOptions[0].value;

      for (var k in defaults) {
        opts[k] = defaults[k];
      }

      setupVersion();
    }

    function setupVersion() {
      // Select current version
      opts.selectedVersion = _.find(opts.versions, function (version) {
        return version.type === 'current';
      }).number;
    }

    function updateLineNumbers() {
      opts.dumpLineNumbers = opts.lineNumbersEnabled && opts.lineNumbers ? opts.lineNumbers : false;
    }

    function updateRootPath() {
      opts.rootpath = opts.rootPathEnabled && opts.rootpathText ? opts.rootpathText : false;
    }

    $scope.toggleOption = function(model) {
      opts[model] = !opts[model];
    };

    $scope.toggleTxt = function(model) {
      return opts[model] ? 'Enabled' : 'Disabled';
    };

    $scope.$watch('opts.lineNumbers+opts.lineNumbersEnabled', updateLineNumbers);
    $scope.$watch('opts.rootpathText', updateRootPath);
  }
]);
