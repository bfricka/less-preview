l2c.controller 'Less2CssCtrl', [
  '$scope'
  ($scope) ->
    stor = new Stor "lessCode"
    # Setup code mirror opts
    $scope.cmOpts =
      theme         : "lesser-dark"
      tabSize       : 2
      lineNumbers   : true
      matchBrackets : true

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

    $scope.dumpLineNumbers = "comments"
]