# Inspired by angular-ui
l2c.directive 'lessEditor', [ ->
  {
    restrict: 'A'
    require: 'ngModel'
    link: (scope, elem, attrs, ngModel) ->
      onChange = ->
        (instance, changeObj) ->
          newValue = instance.getValue()

          if newValue isnt ngModel.$viewValue
            ngModel.$setViewValue newValue
            scope.$apply()
          return

      deferCodeMirror = ->
        opts = scope[attrs.opts]
        codeMirror = CodeMirror.fromTextArea elem[0], opts

        codeMirror.on 'change', onChange(opts.onChange)

        ngModel.$render = ->
          codeMirror.setValue ngModel.$viewValue
          return
        return

      scope.$on 'optionsLoaded', deferCodeMirror
  }
]

l2c.directive 'fadeShow', ->
  (scope, elem, attrs) ->
    $elem = $(elem)
    exp = attrs.fadeShow

    # Check if we're mobile and don't animate by default if so
    duration = 400

    # Fade fn. If init is true (initial load) and exp
    # is false then hide instantly (prevent flash of content)
    fadeElem = (toShow, init = false) ->
      if toShow
        $elem.fadeIn(duration)
      else
        if init then $elem.hide() else $elem.fadeOut(duration)
      return

    fadeElem(scope.$eval(exp), true)

    # Set watch
    scope.$watch ->
      scope.$eval exp
    , (toShow) ->
      fadeElem(toShow)