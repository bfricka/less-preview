l2c.controller('AppCtrl', [
  '$scope', 'LessOptions'
  , function($scope, opts) {
    $scope.opts = opts;

    $scope.toggleDrawer = function(ev) {
      ev.preventDefault();
      $scope.drawerOpen = !$scope.drawerOpen;
    };
  }
]);
