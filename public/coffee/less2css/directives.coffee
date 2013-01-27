# Inspired by angular-ui
l2c.directive 'lessEditor', [
  '$timeout'
  ($timeout) ->
    {
      restrict: 'A'
      require: 'ngModel'
      link: (scope, elem, attrs, ngModel) ->
        opts = scope.cmOpts or {}

        onChange = ->
          (instance, changeObj) ->
            newValue = instance.getValue()

            if newValue isnt ngModel.$viewValue
              ngModel.$setViewValue newValue
              scope.$apply()

            return

        deferCodeMirror = ->
          codeMirror = CodeMirror.fromTextArea elem[0], opts

          codeMirror.on 'change', onChange(opts.onChange)

          ngModel.$render = ->
            codeMirror.setValue ngModel.$viewValue
            return

          return

        $timeout deferCodeMirror
    }
]

l2c.directive 'cssOutput', [
  '$timeout'
  ($timeout) ->
    {
      restrict: 'A'
      require: 'ngModel'

      link: (scope, elem, attrs, ngModel) ->
        opts = scope.cmOpts or {}
        opts.value = ngModel.$viewValue

        deferCodeMirror = ->
          codeMirror = CodeMirror.fromTextArea elem[0], opts

        $timeout deferCodeMirror
    }
]