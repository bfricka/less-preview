l2c

.controller('DrawerCtrl', [
  '$scope'
  , function($scope) {
    $scope.toggleDrawer = this.toggleDrawer = function() {
      $scope.drawerOpen = !$scope.drawerOpen;
    };

    this.isOpen = function() {
      return $scope.drawerOpen;
    };
  }
])

.directive('drawer', [
  '$document'

  , function($document) {
    return {
      replace       : true
      , restrict    : 'E'
      , transclude  : true
      , controller  : 'DrawerCtrl'
      , templateUrl : 'drawer.html'

      , link: function(scope, elem, attrs, ctrl) {
        $document.on('click', function(ev) {
          var target = ev.target;
          if (!target.hasClosestEl(elem[0]) && ctrl.isOpen()) ctrl.toggleDrawer();
        });
      }
    };
  }
]);