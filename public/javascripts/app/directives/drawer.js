l2c.directive('drawer', [
  'TransitionHelper'
  , function(transition) {
    return {
        replace     : true
      , restrict    : 'E'
      , transclude  : true
      , templateUrl : 'drawer.html'
      , scope: {
          open     : '='
        , offset   : '='
        , position : '='
      }

      , link: function(scope, elem, attrs) {
        if (!scope.open) {
          scope.visibile = scope.open = false;
        }

        var el = scope.el = elem[0];
        var translateAxis = scope.position === 'top' || scope.position === 'bottom'
          ? 'Y'
          : 'X';

        function toggleDrawer(isOpen) {
          updateModelDimensions();

          var translateVal = isOpen
            ? scope.offset
            : -scope.height + parseInt(scope.offset, 10);

          transition['translate' + translateAxis](scope.el, translateVal);
        }

        function updateModelDimensions() {
          scope.height = scope.el.offsetHeight;
          scope.width = scope.el.offsetWidth;
        }

        // window.getComputedStyle(el, '')
        // toggleDrawer();

        scope.$watch('open', toggleDrawer);
      }
    };
  }
]);