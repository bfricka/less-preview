l2c = angular.module('Less2Css', []);

l2c.run([
  '$rootScope'

  , function($rootScope) {
    $rootScope.safeApply = function(fn) {
      var phase = this.$root.$$phase
        , fn = fn || function(){};

      if (phase === '$digest' || phase === '$apply') {
        fn();
      } else {
        this.$apply(fn);
      }
    };
  }
]);