l2c.controller 'Less2CssCtrl', [
  '$scope', '$http', 'LessCompiler', 'LessCache'
  ($scope, $http, LessCompiler, LessCache) ->
    # Setup default options
    getOptions = $http.get('/less-options')

    getOptions.success (options) ->
      setOptions(options)
      setLessOptions(options)
      # Let our directive know we've loaded
      $scope.$emit 'optionsLoaded'
      $scope.updateOptions()

      loadLess()

      return

    # Set defaults
    $scope.lessInput = LessCache.get() or $('#lessInput').val()
    $scope.cssOutput = ''
    $scope.rootpath = ''
    $scope.loading = false
    $scope.compileError = false

    # Setup watchers
    getOptions.success ->
      $scope.$watch 'lessInput', (val) ->
        LessCache.set(val)
        compileLess()
        return

      $scope.$watch 'lessOptions', ->
        compileLess()
        return
      , true

      $scope.$watch 'lessOptions.lessVersion', ->
        loadLess()
        return
      return

    $scope.updateOptions = ->
      $scope.lessOptions.dumpLineNumbers =
        if $scope.lineNumbersEnabled then $scope.dumpLineNumbers else false
      $scope.lessOptions.rootpath =
        if $scope.rootPathEnabled then $scope.rootpath else ''

      LessCompiler.updateOptions($scope.lessOptions)
      return

    $scope.toggleLineNumbers = ->
      $scope.lineNumbersEnabled = !$scope.lineNumbersEnabled
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

    loadLess = ->
      $scope.loading = true
      loading = LessCompiler.loadLess()

      loading.done ->
        $scope.$apply ->
          LessCompiler.initLess()
          compileLess()

          $scope.loading = false
          return
        return

    compileLess = ->
      $scope.cssOutput = LessCompiler.compileLess($scope.lessInput)
      $scope.compileError = LessCompiler.error
      $scope.$safeApply()
      return

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
]