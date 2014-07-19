angular
.module('Less2Css', ['Stor', 'TransitionHelper'])
.config([
  '$provide',
  function($provide) {
    $provide.decorator('$rootScope', [
      '$delegate',
      function($rootScope) {
        $rootScope.$safeApply = function() {
          var $scope, fn;
          var args = arguments;
          var force = false;

          switch (args.length) {
            case 1:
              var arg = args[0];
              if (_.isFunction(arg)) fn = arg;
              else $scope = arg;
              break;
            case 3:
              force = !!args[2];
              /* falls through */
            case 2:
              $scope = args[0];
              fn = args[1];
              break;
          }

          $scope = $scope || $rootScope;
          fn = fn || _.noop;

          if(force || !$scope.$$phase) {
            $scope.$apply ? $scope.$apply(fn) : $scope.apply(fn);
          } else {
            fn();
          }
        };

        return $rootScope;
      }
    ]);
  }
]);