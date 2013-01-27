l2c.controller 'Less2CssCtrl', [
  '$scope', '$http'
  ($scope, $http) ->
    stor = new Stor "lessCode"
    # Setup code mirror opts

    $scope.lessOptions =
      dumpLineNumbers : false
      relativeUrls    : false
      rootpath        : false
      filename        : 'less2css.org.less'

    $scope.updateModel = ->
      console.log @

    $scope.$watch 'lessOptions', ->
      $scope.updateModel(@)

    $scope.lessEditorOpts =
      theme         : "lesser-dark"
      tabSize       : 2
      lineNumbers   : true
      matchBrackets : true

    $scope.cssEditorOpts = do ->
      opts = angular.copy $scope.lessEditorOpts
      opts.readOnly = true
      opts

    # Grab latest less versions
    $http.get('/less-versions').success (versions) ->
      # Def label decorator
      getLabel = (type, num) ->
        text =
          if type is 'current'
            "#{num} (current)"
          else if type is 'pre'
            "#{num} (pre-release)"
          else
            num
        text

      # Decorate the initial model with better labeling
      $scope.lessVersions = do ->
        for version in versions
          version.label = getLabel version.type, version.number
        versions

      # Select current version as default less version
      $scope.lessOptions.lessVersion = do ->
        ver = _.find versions, (version) ->
          version.type is 'current'
        ver.number

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

    $scope.dumpLineNumbers = "comments"
]