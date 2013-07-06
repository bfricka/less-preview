l2c.controller('OptionsCtrl', [
  '$scope', 'LessOptions'
  , function($scope, opts) {
    $scope.opts = opts;

    function setupOptions() {
      setVersions();
    }

    function setVersions() {
      // Select current version
      opts.selectedVersion = _.find(opts.versions, function (version) {
        return version.type === 'current';
      }).number;
    }

    $scope.toggleOption = function(model) {
      opts[model] = !opts[model];
    };

    $scope.toggleTxt = function(model) {
      return opts[model] ? 'Enabled' : 'Disabled';
    };

    $scope.$watch('opts', setupOptions);
  }
]);
