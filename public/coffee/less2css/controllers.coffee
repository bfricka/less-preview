l2c.controller 'Less2CssCtrl', [
  '$scope', '$http'
  ($scope, $http) ->
    stor = new Stor "lessCode"
    # Setup code mirror opts

    $scope.updateOptions = ->
      console.log @

    # Grab latest less versions
    $http.get('/less-options').success (options) ->
      setOptions(options)
      # Let our directive know we've loaded
      $scope.$emit 'optionsLoaded'
      # Select current version as default less version
      $scope.lessOptions.lessVersion = do ->
        ver = _.find $scope.lessVersions, (version) ->
          version.type is 'current'
        ver.number
      return

    $scope.cssOutput = 'a.cool { display: none; }'

    $scope.$watch 'lessInput', (val) ->

    $scope.lineNumberOpts =
      'comments'   : "Comments"
      'mediaquery' : "Media Query"
      'all'        : "All"

    $scope.toggleTxt = (model) ->
      if $scope[model]
        "Enabled"
      else
        "Disabled"

    # Set initial model based on textarea
    $scope.lessInput = document.getElementById('lessInput').value

    # All options currently map directly to scope
    setOptions = (opts) ->
      for k, v of opts
        $scope[k] = v
      return
]