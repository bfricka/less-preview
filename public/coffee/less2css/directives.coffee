# Barrowed from angular-ui

l2c.directive 'lessEditor', [
  '$timeout'
  ($timeout) ->
    events = ["cursorActivity", "viewportChange", "gutterClick", "focus", "blur", "scroll", "update"]

    {
      require: 'ngModel'
      link: (scope, elem, attrs, ngModel) ->

        # Setup code mirror opts
        opts =
          theme: "lesser-dark"
          lineNumbers: true
          matchBrackets: true
          tabSize: 2


        onChange = (evt) ->
          (instance, changeObj) ->
            newValue = instance.getValue()

            if newValue isnt ngModel.$viewValue
              ngModel.$setViewValue newValue
              scope.$apply()

            evt instance, changeObj if typeof evt is "function"
            return

        deferCodeMirror = ->
          codeMirror = CodeMirror.fromTextArea(elem[0], opts)
          codeMirror.on "change", onChange(opts.onChange)
          i = 0
          n = events.length
          evt = undefined

          while i < n
            evt = opts["on" + events[i].charAt(0).toUpperCase() + events[i].slice(1)]
            continue  if evt is undefined
            continue  if typeof evt isnt "function"
            codeMirror.on events[i], evt
            ++i

          # CodeMirror expects a string, so make sure it gets one.
          # This does not change the model.
          ngModel.$formatters.push (value) ->
            if angular.isUndefined(value) or value is null
              return ""
            else throw new Error("ui-codemirror cannot use an object or an array as a model")  if angular.isObject(value) or angular.isArray(value)
            value


          # Override the ngModelController $render method, which is what gets called when the model is updated.
          # This takes care of the synchronizing the codeMirror element with the underlying model, in the case that it is changed by something else.
          ngModel.$render = ->
            codeMirror.setValue ngModel.$viewValue

        $timeout deferCodeMirror
    }
]