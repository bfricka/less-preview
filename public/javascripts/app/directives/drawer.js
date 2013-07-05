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
          el.style.opacity = isOpen ? 1 : 0;
        }

        function updateModelDimensions() {
          scope.height = scope.el.offsetHeight;
          scope.width = scope.el.offsetWidth;
        }

        scope.$watch('open', toggleDrawer);
      }
    };
  }
]);