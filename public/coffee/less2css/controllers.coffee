l2c.controller 'Less2CssCtrl', [
  '$scope'
  ($scope) ->
    stor = new Stor "lessCode"

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