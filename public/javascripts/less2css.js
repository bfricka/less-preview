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
          lessOptions: $('#lessOptions'),
          optsDrawer: $('#optionsDrawer'),
          optsWrap: $('#optionsDrawerWrap'),
          optsBtn: $('#optionsButton'),
          optsLnk: $('#optionsLink'),
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

  l2c.factory('LessCompiler', function() {
    var LessCompiler;
    LessCompiler = (function() {

      function LessCompiler() {
        this.options = {
          useFallback: false,
          saveLess: true,
          lessPath: "/javascripts/less/less-{version}.js",
          lessOptions: {
            dumpLineNumbers: false,
            relativeUrls: false,
            rootpath: false,
            filename: 'less2css.org.less'
          }
        };
        this.defaults = _.cloneDeep(this.options);
        return;
      }

      LessCompiler.prototype.updateOptions = function(model) {
        var opts, prop, val;
        opts = this.options.lessOptions;
        for (prop in opts) {
          val = opts[prop];
          opts[prop] = model.hasOwnProperty(prop) ? model[prop] : this.defaults.lessOptions[prop];
        }
      };

      LessCompiler.prototype.setupEvents = function() {
        var cachedLess, editor, els, self, versionOpts;
        self = this;
        els = this.elements;
        editor = this.editor;
        cachedLess = this.storage.get();
        versionOpts = els.lessVersion.find('option');
        if (cachedLess) {
          editor.setValue(cachedLess);
          this.previousLessCode = cachedLess;
        } else {
          this.previousLessCode = editor.getValue();
        }
        this.drawer.on('change', function(e, model) {
          var field, fieldName, preRelease;
          field = $(e.target);
          fieldName = field.attr('name');
          if (fieldName === 'lessVersion') {
            preRelease = field.find('option').filter(':selected').is('[data-prerelease=true]') ? true : false;
            self.loadLess(preRelease);
          } else {
            self.updateOptions(model);
            self.loadComplete.call(self);
          }
          return console.log(model);
        });
        editor.on("change", function() {
          var lessCode;
          lessCode = self.editor.getValue();
          if (self.previousLessCode === lessCode) {
            return;
          }
          self.previousLessCode = lessCode;
          self.compileLess();
        });
        return this;
      };

      LessCompiler.prototype.loadLess = function(preRelease) {
        var els, getScript, opts, scriptUrl, self, version;
        self = this;
        opts = this.options;
        els = this.elements;
        els.loadingGif.fadeIn();
        this.editor.options.readOnly = true;
        version = els.lessVersion.val();
        version = preRelease ? "" + version + "-alpha" : version;
        scriptUrl = opts.lessPath.replace("{version}", version);
        window.less = undefined;
        getScript = $.ajax({
          dataType: "script",
          cache: true,
          url: scriptUrl
        });
        getScript.done(function() {
          self.loadComplete.call(self);
        });
        return this;
      };

      LessCompiler.prototype.loadComplete = function() {
        this.parser = new less.Parser(this.options.lessOptions);
        this.editor.options.readOnly = false;
        this.compileLess();
        this.elements.loadingGif.fadeOut();
        return this;
      };

      LessCompiler.prototype.compileLess = function() {
        var compiledCSS, lessCode;
        lessCode = this.editor.getValue();
        if (this.options.saveLess) {
          this.storage.set(lessCode);
        }
        try {
          compiledCSS = this.parseLess(lessCode);
          this.updateCSS(compiledCSS);
        } catch (lessEx) {
          this.updateError(lessEx);
        }
        return this;
      };

      LessCompiler.prototype.updateCSS = function(compiledCSS) {
        var highlightedCSS;
        highlightedCSS = hljs.highlight("css", compiledCSS).value;
        this.elements.cssCode.css("color", "").html(highlightedCSS);
        return this;
      };

      LessCompiler.prototype.updateError = function(lessEx) {
        var errorText;
        errorText = ("" + lessEx.type + " error: " + lessEx.message) + "\n" + (lessEx.extract && lessEx.extract.join && lessEx.extract.join(""));
        this.elements.cssCode.css("color", "red").text(errorText);
        return this;
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
    jQuery(function($) {
      var compiler, elements;
      elements = {
        lessVersion: $("#lessVersion"),
        loadingGif: $("#loadingGif"),
        lessInput: $("#lessInput"),
        cssCode: $("#cssOutput")
      };
      compiler = window.comp = new LessCompiler(elements);
      return compiler.setupEvents().loadLess();
    });
    return new LessCompiler();
  });

  l2c.controller('Less2CssCtrl', [
    '$scope', '$http', function($scope, $http) {
      var setLessOptions, setOptions, stor;
      stor = new Stor("lessCode");
      $scope.updateOptions = function() {
        console.log(this);
        $scope.lessOptions.dumpLineNumbers = $scope.lineNumbersEnabled ? $scope.dumpLineNumbers : false;
        return $scope.lessOptions.rootpath = $scope.rootPathEnabled ? $scope.rootpath : false;
      };
      $scope.toggleLineNumbers = function() {
        $scope.lineNumbersEnabled = !$scope.lineNumbersEnabled;
        $scope.updateOptions();
      };
      $scope.toggleRootPath = function() {
        $scope.rootPathEnabled = !$scope.rootPathEnabled;
        $scope.updateOptions();
      };
      $http.get('/less-options').success(function(options) {
        setOptions(options);
        setLessOptions(options);
        $scope.$emit('optionsLoaded');
      });
      $scope.cssOutput = 'a.cool { display: none; }';
      $scope.$watch('lessInput', function(val) {});
      $scope.toggleTxt = function(model) {
        if ($scope[model]) {
          return "Enabled";
        } else {
          return "Disabled";
        }
      };
      $scope.lessInput = document.getElementById('lessInput').value;
      setOptions = function(opts) {
        var k, v;
        for (k in opts) {
          v = opts[k];
          $scope[k] = v;
        }
      };
      return setLessOptions = function(opts) {
        $scope.lessOptions.lessVersion = (function() {
          var ver;
          ver = _.find(opts.lessVersions, function(version) {
            return version.type === 'current';
          });
          return ver.number;
        })();
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
