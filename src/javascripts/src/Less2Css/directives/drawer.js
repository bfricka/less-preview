angular
.module('Less2Css')
.directive('drawer', [
  'TransitionHelper',
  function(TransitionHelper) {
    return {
      replace     : true,
      restrict    : 'E',
      transclude  : true,
      templateUrl : 'drawer.html',
      scope: {
        open     : '=',
        opts     : '=',
        offset   : '=',
        position : '='
      },

      link: function(scope, elem) {
        var el = scope.el = elem[0];
        var translateAxis = scope.position === 'top' || scope.position === 'bottom'
          ? 'Y'
          : 'X';

        function toggleDrawer(isOpen) {
          updateModelDimensions();

          var translateVal = isOpen
            ? scope.offset
            : -scope.height + _.parseInt(scope.offset);

          TransitionHelper['translate' + translateAxis](el, translateVal);
          el.style.opacity = isOpen ? 1 : 0;
        }

        function updateModelDimensions() {
          scope.height = el.offsetHeight;
          scope.width = el.offsetWidth;
        }

        scope.$watch('open', toggleDrawer);
      }
    };
  }
]);