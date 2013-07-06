l2c.controller('AppCtrl', [
  '$scope', 'LessOptions'
  , function($scope, LessOptions) {
    LessOptions.then(function(data) {
      $scope.opts = data.opts;
    });

    $scope.toggleDrawer = function(ev) {
      ev.preventDefault();
      $scope.drawerOpen = !$scope.drawerOpen;
    };
  }
]);
