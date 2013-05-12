l2c.directive('fadeShow', function() {
  function fadeShow(scope, elem, attrs) {
    var $elem = $(elem)
      , exp = attrs.fadeShow
      , duration = 400;

    fadeElem(scope.$eval(exp), true);

    scope.$watch(function() {
      return scope.$eval(exp);
    }, function(toShow) {
      fadeElem(toShow);
    });

    function fadeElem(toShow, init) {
      if (init == null) init = false;

      if (toShow) {
        $elem.fadeIn(duration);
      } else {
        init ? $elem.hide() : $elem.fadeOut(duration);
      }
    }
  }

  return fadeShow;
});