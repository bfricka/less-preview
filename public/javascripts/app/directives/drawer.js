l2c

.controller('DrawerCtrl', [
  '$scope'
  , function($scope) {
    $scope.toggleDrawer = this.toggleDrawer = function() {
      $scope.isOpen = !$scope.isOpen;
    };

    function toggle() { $scope.isOpen = $scope.open; }
    this.isOpen = function() { return $scope.isOpen; };

    $scope.$watch('open', toggle);
  }
])

.directive('drawer', [
  '$document', 'TransitionHelper'
  , function(doc, transition) {
    return {
      replace       : true
      , restrict    : 'E'
      , transclude  : true
      , controller  : 'DrawerCtrl'
      , templateUrl : 'drawer.html'
      , scope: {
        open       : '='
        , offset   : '='
        , position : '='
      }

      , link: function(scope, elem, attrs, ctrl) {
        var el = scope.el = elem[0];

        var translateAxis = scope.position === 'top' || scope.position === 'bottom'
          ? 'Y'
          : 'X';

        function toggleDrawer(isOpen) {
          updateModelDimensions();

          var translateVal = isOpen
            ? -scope.height + parseInt(scope.offset, 10)
            : scope.offset;

          transition['translate' + translateAxis](scope.el, translateVal);
        }

        function updateModelDimensions() {
          scope.height = scope.el.offsetHeight;
          scope.width = scope.el.offsetWidth;
        }

        doc.on('click', function(ev) {
          if (!ctrl.isOpen()) return; // Quick return for common case
          if (!ev.target.hasClosestEl(el)) ctrl.toggleDrawer();
        });

        scope.$watch('isOpen', toggleDrawer);
      }
    };
  }
]);