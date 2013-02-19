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
    $scope.legacyUnits = false
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
      lessOpts = $scope.lessOptions

      lessOpts.dumpLineNumbers =
        if $scope.lineNumbersEnabled then $scope.dumpLineNumbers else false
      lessOpts.rootpath =
        if $scope.rootPathEnabled then $scope.rootpath else ''

      # Validate legacy units in case we switch to a version that doesn't support it
      $scope.legacyUnits =
        if !$scope.isLegacy() and $scope.legacyUnits then true else false

      # Strict maths/units comprise legacy so set them both
      lessOpts.strictMaths =
      lessOpts.strictUnits = if $scope.legacyUnits then false else true

      LessCompiler.updateOptions(lessOpts)
      return

    # Toggle any model
    $scope.toggleModel = (model) ->
      $scope[model] = !$scope[model]
      $scope.updateOptions()
      return

    $scope.toggleTxt = (model) ->
      if $scope[model]
        "Enabled"
      else
        "Disabled"

    # See if we're at least 1.4 for these options
    $scope.isLegacy = ->
      if (!$scope.lessOptions)
        false
      else
        parseFloat($scope.lessOptions.lessVersion, 10) < 1.4

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