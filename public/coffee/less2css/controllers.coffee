l2c.controller 'Less2CssCtrl', [
  '$scope'
  ($scope) ->
    stor = new Stor "lessCode"
    # Setup code mirror opts
    $scope.lessEditorOpts =
      theme         : "lesser-dark"
      tabSize       : 2
      lineNumbers   : true
      matchBrackets : true

    $scope.cssEditorOpts = do ->
      opts = angular.copy $scope.lessEditorOpts
      opts.readOnly = true
      opts

    $scope.cssOutput = 'a.cool { display: none; }'

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