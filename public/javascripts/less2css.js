(function() {
  var Stor, l2c;

  Stor = (function() {

    function Stor(key, exp) {
      this.key = (key != null ? key : void 0);
      this.exp = (exp != null ? exp : null);
      this.amp = amplify.store;
    }

    Stor.prototype.get = function(key) {
      if (key == null) {
        key = this.key;
      }
      return this.amp(key);
    };

    Stor.prototype.set = function(val, key, exp) {
      if (key == null) {
        key = this.key;
      }
      if (exp == null) {
        exp = this.exp;
      }
      return this.amp(key, val, exp);
    };

    Stor.prototype.remove = function(key) {
      if (key == null) {
        key = this.key;
      }
      return this.amp(key, null);
    };

    Stor.prototype.empty = function() {
      var self, storage;
      self = this;
      storage = self.amp();
      return $.each(storage, function(itm, key) {
        self.amp(key, null);
      });
    };

    return Stor;

  })();

  l2c = angular.module('Less2Css', []);

  l2c.run([
    '$rootScope', function($rootScope) {
      return $rootScope.$safeApply = function($scope, fn) {
        $scope = $scope || $rootScope;
        fn = fn || function() {};
        if ($scope.$$phase) {
          fn();
        } else {
          $scope.$apply(fn);
        }
      };
    }
  ]);

  l2c.directive('lessEditor', [
    '$timeout', function($timeout) {
      var events;
      events = ["cursorActivity", "viewportChange", "gutterClick", "focus", "blur", "scroll", "update"];
      return {
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
          var deferCodeMirror, onChange, opts;
          opts = {
            theme: "lesser-dark",
            lineNumbers: true,
            matchBrackets: true,
            tabSize: 2
          };
          onChange = function(evt) {
            return function(instance, changeObj) {
              var newValue;
              newValue = instance.getValue();
              if (newValue !== ngModel.$viewValue) {
                ngModel.$setViewValue(newValue);
                scope.$apply();
              }
              if (typeof evt === "function") {
                evt(instance, changeObj);
              }
            };
          };
          deferCodeMirror = function() {
            var codeMirror, evt, i, n;
            codeMirror = CodeMirror.fromTextArea(elem[0], opts);
            codeMirror.on("change", onChange(opts.onChange));
            i = 0;
            n = events.length;
            evt = void 0;
            while (i < n) {
              evt = opts["on" + events[i].charAt(0).toUpperCase() + events[i].slice(1)];
              if (evt === void 0) {
                continue;
              }
              if (typeof evt !== "function") {
                continue;
              }
              codeMirror.on(events[i], evt);
              ++i;
            }
            ngModel.$formatters.push(function(value) {
              if (angular.isUndefined(value) || value === null) {
                return "";
              } else {
                if (angular.isObject(value) || angular.isArray(value)) {
                  throw new Error("ui-codemirror cannot use an object or an array as a model");
                }
              }
              return value;
            });
            return ngModel.$render = function() {
              return codeMirror.setValue(ngModel.$viewValue);
            };
          };
          return $timeout(deferCodeMirror);
        }
      };
    }
  ]);

  l2c.controller('Less2CssCtrl', [
    '$scope', function($scope) {
      var stor;
      stor = new Stor("lessCode");
      $scope.lineNumberOpts = {
        'comments': "Comments",
        'mediaquery': "Media Query",
        'all': "All"
      };
      $scope.toggleTxt = function(model) {
        if ($scope[model]) {
          return "Enabled";
        } else {
          return "Disabled";
        }
      };
      return $scope.dumpLineNumbers = "comments";
    }
  ]);

}).call(this);
