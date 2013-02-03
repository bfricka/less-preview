l2c.controller 'Less2CssCtrl', [
  '$scope', '$http', 'LessCompiler'
  ($scope, $http, LessCompiler) ->
    # Set-up default options
    $http.get('/less-options').success (options) ->
      setOptions(options)
      setLessOptions(options)
      # Let our directive know we've loaded
      $scope.$emit 'optionsLoaded'
      $scope.updateOptions()

      loading = LessCompiler.loadLess()

      loading.done ->
        console.log "Done"
        LessCompiler.initLess()
        $scope.compileLess()
        return
      return

    $scope.cssOutput = ''

    $scope.$watch 'lessInput', ->
      $scope.compileLess()

    $scope.$watch 'lessOptions', ->
      $scope.compileLess()
    , true

    $scope.updateOptions = ->
      $scope.lessOptions.dumpLineNumbers =
        if $scope.lineNumbersEnabled then $scope.dumpLineNumbers else false
      $scope.lessOptions.rootpath =
        if $scope.rootPathEnabled then $scope.rootpath else false
      LessCompiler.updateOptions($scope.lessOptions)

    $scope.toggleLineNumbers = ->
      $scope.lineNumbersEnabled = not $scope.lineNumbersEnabled
      $scope.updateOptions()
      return

    $scope.toggleRootPath = ->
      $scope.rootPathEnabled = !$scope.rootPathEnabled
      $scope.updateOptions()
      return

    $scope.toggleTxt = (model) ->
      if $scope[model]
        "Enabled"
      else
        "Disabled"

    # Set initial model based on textarea
    $scope.lessInput = document.getElementById('lessInput').value

    # All standard mapping options
    setOptions = (opts) ->
      for k, v of opts
        $scope[k] = v
      return

    # Set defaults for lessOptions selects
    setLessOptions = (opts) ->
      # Select current version as default less version
      # And identify pre-release
      _.each opts.lessVersions, (version) ->
        if version.type is 'current'
          $scope.lessOptions.lessVersion = version.number

        if version.type is 'pre'
          $scope.lessOptions.preRelease = version.number

      $scope.dumpLineNumbers = do ->
        sel = _.find opts.lineNumberOptions, (opt) ->
          !!opt.default
        sel.value
      return

    $scope.compileLess = ->
      $scope.cssOutput = LessCompiler.compileLess($scope.lessInput)
      $scope.$safeApply()
]