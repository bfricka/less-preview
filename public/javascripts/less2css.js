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

  jQuery(function($) {
    var OptionsDrawer, optsDrawer;
    OptionsDrawer = (function() {

      function OptionsDrawer() {
        this.els = {
          lessOptions: $('#less-options'),
          optsDrawer: $('#options-drawer'),
          optsWrap: $('#options-drawer-wrap'),
          optsBtn: $('#options-button'),
          optsLnk: $('#options-link'),
          nav: $('#nav')
        };
        this.fx = {
          'duration': 300
        };
        this.text = {
          'optsOpen': 'Close',
          'optsDefault': 'Options'
        };
        this.isOpen = false;
        this.closeDrawer(true);
        this.setupEvents();
      }

      OptionsDrawer.prototype.setupEvents = function() {
        var els, self;
        self = this;
        els = self.els;
        els.optsBtn.on('click', function(e) {
          e.preventDefault();
          if (self.isOpen) {
            self.closeDrawer.call(self);
          } else {
            self.openDrawer.call(self);
          }
        });
        els.optsLnk.on('click', function(e) {
          e.preventDefault();
          els.optsBtn.trigger('click');
        });
      };

      OptionsDrawer.prototype.openDrawer = function() {
        var opts, props;
        this.els.lessOptions.addClass('open');
        props = {
          'top': this.els.nav.height(),
          'opacity': 1
        };
        opts = {
          'duration': this.fx.duration
        };
        this.detach();
        this.animateDrawer('open', props, opts);
      };

      OptionsDrawer.prototype.closeDrawer = function(start) {
        var els, opts, props;
        els = this.els;
        els.lessOptions.removeClass('open');
        props = {
          'top': -(this.getDrawerTop()),
          'opacity': 0
        };
        opts = {
          'duration': start ? 0 : this.fx.duration
        };
        opts.complete = start ? function() {
          return els.optsDrawer.fadeIn();
        } : undefined;
        this.animateDrawer('close', props, opts);
      };

      OptionsDrawer.prototype.animateDrawer = function(action, props, opts) {
        var cb, defer, optsDrawer, self;
        self = this;
        optsDrawer = this.els.optsDrawer;
        defer = new $.Deferred();
        cb = opts.complete || function() {};
        opts.complete = function() {
          defer.resolve();
          return cb.apply(self, arguments);
        };
        optsDrawer.animate(props, opts);
        defer.done(function() {
          if (action === 'close') {
            return self.onClose.call(self);
          } else {
            return self.onOpen.call(self);
          }
        });
      };

      OptionsDrawer.prototype.onOpen = function() {
        this.isOpen = true;
      };

      OptionsDrawer.prototype.onClose = function() {
        this.attach();
        this.isOpen = false;
      };

      OptionsDrawer.prototype.getDrawerTop = function() {
        return this.els.optsDrawer.outerHeight() - this.els.nav.height();
      };

      OptionsDrawer.prototype.getBtnLeft = function() {
        var btn;
        btn = this.els.optsBtn[0];
        return btn.parentElement.offsetLeft + btn.parentElement.parentElement.offsetLeft;
      };

      OptionsDrawer.prototype.attach = function() {
        this.els.optsBtn.insertAfter(this.els.optsLnk);
        this.els.optsBtn.removeClass('active')[0].style.cssText = "";
      };

      OptionsDrawer.prototype.detach = function() {
        var els, left, optsBtn, wid;
        els = this.els;
        optsBtn = els.optsBtn;
        wid = optsBtn.width();
        left = this.getBtnLeft();
        els.optsBtn.css({
          'left': left,
          'width': wid
        }).addClass('active');
        this.els.optsBtn.appendTo(this.els.optsWrap);
      };

      return OptionsDrawer;

    })();
    return optsDrawer = new OptionsDrawer();
  });

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
    function() {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
          var deferCodeMirror, onChange;
          onChange = function() {
            return function(instance, changeObj) {
              var newValue;
              newValue = instance.getValue();
              if (newValue !== ngModel.$viewValue) {
                ngModel.$setViewValue(newValue);
                scope.$apply();
              }
            };
          };
          deferCodeMirror = function() {
            var codeMirror, opts;
            opts = scope[attrs.opts];
            codeMirror = CodeMirror.fromTextArea(elem[0], opts);
            codeMirror.on('change', onChange(opts.onChange));
            ngModel.$render = function() {
              codeMirror.setValue(ngModel.$viewValue);
            };
          };
          return scope.$on('optionsLoaded', deferCodeMirror);
        }
      };
    }
  ]);

  l2c.directive('fadeShow', function() {
    return function(scope, elem, attrs) {
      var $elem, duration, exp, fadeElem;
      $elem = $(elem);
      exp = attrs.fadeShow;
      duration = 400;
      fadeElem = function(toShow, init) {
        if (init == null) {
          init = false;
        }
        if (toShow) {
          $elem.fadeIn(duration);
        } else {
          if (init) {
            $elem.hide();
          } else {
            $elem.fadeOut(duration);
          }
        }
      };
      fadeElem(scope.$eval(exp), true);
      return scope.$watch(function() {
        return scope.$eval(exp);
      }, function(toShow) {
        return fadeElem(toShow);
      });
    };
  });

  l2c.factory('LessCache', function() {
    return new Stor('lessCode');
  });

  l2c.factory('LessCompiler', [
    '$http', 'LessCache', function($http, LessCache) {
      var LessCompiler;
      LessCompiler = (function() {

        function LessCompiler() {
          this.options = {
            saveLess: true,
            lessPath: "/javascripts/less/less-{version}.js"
          };
          this.defaults = _.cloneDeep(this.options);
          this.storage = LessCache;
          return;
        }

        LessCompiler.prototype.updateOptions = function(options) {
          return this.lessOptions = options;
        };

        LessCompiler.prototype.loadLess = function() {
          var getScript, lessOptions, opts, scriptUrl, version;
          opts = this.options;
          lessOptions = this.lessOptions;
          version = lessOptions.lessVersion;
          version = version === lessOptions.preRelease ? "" + version + "-alpha" : version;
          scriptUrl = opts.lessPath.replace("{version}", version);
          window.less = undefined;
          getScript = $.ajax({
            dataType: "script",
            cache: true,
            url: scriptUrl
          });
          return getScript;
        };

        LessCompiler.prototype.initLess = function() {
          return this.parser = new less.Parser(this.lessOptions);
        };

        LessCompiler.prototype.compileLess = function(lessCode) {
          var compiledCSS;
          try {
            compiledCSS = this.parseLess(lessCode, this.lessOptions);
            this.error = false;
            return compiledCSS;
          } catch (lessEx) {
            this.error = true;
            return this.updateError(lessEx);
          }
        };

        LessCompiler.prototype.updateError = function(lessEx) {
          var errorText;
          errorText = ("" + lessEx.type + " error: " + lessEx.message) + "\n" + (lessEx.extract && lessEx.extract.join && lessEx.extract.join(""));
          return errorText;
        };

        LessCompiler.prototype.parseLess = function(lessCode) {
          var resultCss;
          resultCss = "";
          this.parser.parse(lessCode, function(lessEx, result) {
            if (lessEx) {
              throw lessEx;
            }
            return resultCss = result.toCSS();
          });
          return resultCss;
        };

        return LessCompiler;

      })();
      return new LessCompiler();
    }
  ]);

  l2c.controller('Less2CssCtrl', [
    '$scope', '$http', 'LessCompiler', 'LessCache', function($scope, $http, LessCompiler, LessCache) {
      var compileLess, getOptions, loadLess, setLessOptions, setOptions;
      getOptions = $http.get('/less-options');
      getOptions.success(function(options) {
        setOptions(options);
        setLessOptions(options);
        $scope.$emit('optionsLoaded');
        $scope.updateOptions();
        loadLess();
      });
      $scope.lessInput = LessCache.get() || $('#lessInput').val();
      $scope.cssOutput = '';
      $scope.rootpath = '';
      $scope.loading = false;
      $scope.compileError = false;
      getOptions.success(function() {
        $scope.$watch('lessInput', function(val) {
          LessCache.set(val);
          compileLess();
        });
        $scope.$watch('lessOptions', function() {
          compileLess();
        }, true);
        $scope.$watch('lessOptions.lessVersion', function() {
          loadLess();
        });
      });
      $scope.updateOptions = function() {
        $scope.lessOptions.dumpLineNumbers = $scope.lineNumbersEnabled ? $scope.dumpLineNumbers : false;
        $scope.lessOptions.rootpath = $scope.rootPathEnabled ? $scope.rootpath : '';
        LessCompiler.updateOptions($scope.lessOptions);
      };
      $scope.toggleLineNumbers = function() {
        $scope.lineNumbersEnabled = !$scope.lineNumbersEnabled;
        $scope.updateOptions();
      };
      $scope.toggleRootPath = function() {
        $scope.rootPathEnabled = !$scope.rootPathEnabled;
        $scope.updateOptions();
      };
      $scope.toggleTxt = function(model) {
        if ($scope[model]) {
          return "Enabled";
        } else {
          return "Disabled";
        }
      };
      loadLess = function() {
        var loading;
        $scope.loading = true;
        loading = LessCompiler.loadLess();
        return loading.done(function() {
          $scope.$apply(function() {
            LessCompiler.initLess();
            compileLess();
            $scope.loading = false;
          });
        });
      };
      compileLess = function() {
        $scope.cssOutput = LessCompiler.compileLess($scope.lessInput);
        $scope.compileError = LessCompiler.error;
        $scope.$safeApply();
      };
      setOptions = function(opts) {
        var k, v;
        for (k in opts) {
          v = opts[k];
          $scope[k] = v;
        }
      };
      return setLessOptions = function(opts) {
        _.each(opts.lessVersions, function(version) {
          if (version.type === 'current') {
            $scope.lessOptions.lessVersion = version.number;
          }
          if (version.type === 'pre') {
            return $scope.lessOptions.preRelease = version.number;
          }
        });
        $scope.dumpLineNumbers = (function() {
          var sel;
          sel = _.find(opts.lineNumberOptions, function(opt) {
            return !!opt["default"];
          });
          return sel.value;
        })();
      };
    }
  ]);

}).call(this);
