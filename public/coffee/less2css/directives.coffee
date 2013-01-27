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