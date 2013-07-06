l2c.controller('OptionsCtrl', [
  '$scope', 'LessOptions'
  , function($scope, LessOptions) {
    var defaults, opts;

    LessOptions.then(function(data) {
      defaults = data.getDefaults();
      $scope.opts = opts = data.opts;
      setupOptions();
    });

    function setupOptions() {
      setVersions();
    }

    function setVersions() {
      opts.versions = defaults.lessVersions;
      // Select current version
      opts.selectedVersion = _.find(defaults.lessVersions, function (version) {
        return version.type === 'current';
      }).number;
    }
  }
]);
