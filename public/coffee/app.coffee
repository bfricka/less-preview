l2c = angular.module 'Less2Css', []

l2c.run [
  '$rootScope'
  ($rootScope) ->
    $rootScope.$safeApply = ($scope, fn) ->
      $scope = $scope or $rootScope
      fn = fn or ->

      if $scope.$$phase
        fn()
      else
        $scope.$apply fn
      return
]