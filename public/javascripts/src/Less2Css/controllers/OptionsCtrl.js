angular
.module('Less2Css')
.controller('OptionsCtrl', [
  '$scope',
  '$rootScope',
  'LessOptions',
  function($scope, $rootScope, LessOptions) {
    var opts = $scope.opts = LessOptions.options;

    LessOptions.request.then(setupOptions);

    _.extend($scope, {
      resetOptions: ['Options', 'Editor', 'Both'],

      toggleOption: function(model) {
        opts[model] = !opts[model];
      },

      toggleTxt: function(model) {
        return opts[model] ? 'Enabled' : 'Disabled';
      },

      reset: function(val) {
        $rootScope.$broadcast('Reset:' + val);
      }
    });

    $scope.lessReset = $scope.resetOptions[0];

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

    $scope.$watch('opts.lineNumbers+opts.lineNumbersEnabled', updateLineNumbers);
    $scope.$watch('opts.rootpathText+opts.rootpath', updateRootPath);
    $scope.$watch('opts.selectedVersion', updateVersion);
  }
]);
