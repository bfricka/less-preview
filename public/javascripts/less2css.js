/* less2css - v0.0.5 - http://less2css.org/
 * Copyright (c) 2013 Brian Frichette. All rights reserved.
 * Licensed MIT - http://opensource.org/licenses/MIT
 */
jQuery(function($) {
  var OptionsDrawer = (function() {

    OptionsDrawer.name = 'OptionsDrawer';

    function OptionsDrawer() {
      this.els = {
        lessOptions: $('#less-options'),
        optsDrawer: $('#options-drawer'),
        optsWrap: $('#options-drawer-wrap'),
        optsBtn: $('#options-button'),
        optsLnk: $('#options-link'),
        nav: $('#nav')
      };
      this.fx = { 'duration': 300 };

      this.text = {
        'optsOpen': 'Close',
        'optsDefault': 'Options'
      };

      this.isOpen = false;
      this.closeDrawer(true);
      this.setupEvents();
    }

    OptionsDrawer.prototype = {
      setupEvents: function() {
        var self = this
          , els = self.els;

        els.optsBtn.on('click', function(e) {
          e.preventDefault();
          self.isOpen
            ? self.closeDrawer.call(self)
            : self.openDrawer.call(self);
        });

        els.optsLnk.on('click', function(e) {
          e.preventDefault();
          els.optsBtn.trigger('click');
        });
      }

      , openDrawer: function() {
        var props = { 'top': this.els.nav.height(), 'opacity': 1 }
          , opts = { 'duration': this.fx.duration };

        this.els.lessOptions.addClass('open');
        this.detach();
        this.animateDrawer('open', props, opts);
      }

      , closeDrawer: function(start) {
        var els = this.els
          , props = { 'top': -(this.getDrawerTop()), 'opacity': 0 }
          , opts = { 'duration': start ? 0 : this.fx.duration };

        els.lessOptions.removeClass('open');

        opts.complete = start ? function() {
          els.optsDrawer.fadeIn();
        } : undefined;

        this.animateDrawer('close', props, opts);
      }

      , animateDrawer: function(action, props, opts) {
        var self = this
          , optsDrawer = this.els.optsDrawer
          , defer = new $.Deferred()
          , cb = opts.complete || function() {};

        opts.complete = function() {
          defer.resolve();
          return cb.apply(self, arguments);
        };

        optsDrawer.animate(props, opts);
        defer.done(function() {
          (action === 'close')
            ? self.onClose.call(self)
            : self.onOpen.call(self);
        });
      }

      , getDrawerTop: function() {
        return this.els.optsDrawer.outerHeight() - this.els.nav.height();
      }

      , getBtnLeft: function() {
        var btn = this.els.optsBtn[0];
        return btn.parentElement.offsetLeft + btn.parentElement.parentElement.offsetLeft;
      }

      , attach: function() {
        this.els.optsBtn.insertAfter(this.els.optsLnk);
        this.els.optsBtn.removeClass('active')[0].style.cssText = "";
      }

      , detach: function() {
        var els = this.els
          , optsBtn = els.optsBtn
          , wid = optsBtn.width()
          , left = this.getBtnLeft();

        els.optsBtn
          .css({ 'left': left, 'width': wid })
          .addClass('active');

        this.els.optsBtn.appendTo(this.els.optsWrap);
      }

      , onOpen: function() { this.isOpen = true; }
      , onClose: function() { this.attach(); this.isOpen = false; }
    };

    return OptionsDrawer;

  })();
  return new OptionsDrawer();
});

l2c = angular.module('Less2Css', []);

l2c.run([
  '$rootScope'

  , function($rootScope) {
    $rootScope.safeApply = function(fn) {
      var phase = this.$root.$$phase
        , fn = fn || function(){};

      if (phase === '$digest' || phase === '$apply') {
        fn();
      } else {
        this.$apply(fn);
      }
    };
  }
]);
l2c.factory('Stor', [
    '$q'
  , '$rootScope'
  , '$timeout'

  , function($q, $rootScope, $timeout) {
    var Stor = (function() {
      Stor.name = 'Stor';

      function Stor(key, exp) {
        this.key = key != null ? key : void 0;
        this.exp = exp != null ? exp : null;
        this.amp = amplify.store;
      }

      Stor.prototype = {
        get: function(key) {
          if (key == null) key = this.key;
          return this.amp(key);
        }

        , set: function(val, key, exp) {
          if (key == null) key = this.key;
          if (exp == null) exp = this.exp;

          return this.amp(key, val, {
            expires: exp
          });
        }

        , remove: function(key) {
          if (key == null) key = this.key;
          this.amp(key, null);
        }

        , empty: function() {
          var storage = this.amp();

          for (var key in storage) {
            this.amp(key, null);
          }
        }

        , getAsync: function() {
          var fn = arguments[0]
            , args = [].slice.call(arguments, 1)
            , q = $q.defer()
            , self = this;

          $timeout(function() {
            var data = self.get.apply(self, args);

            if (data) {
              $rootScope.safeApply($rootScope, function() {
                q.resolve({ data: data, type: 'local' });
              });
            } else {
              var req = fn()
                , ret = { type: 'xhr' };

              req.then(function(res) {
                return $rootScope.safeApply($rootScope, function() {
                  ret.data = res.data;
                  ret.status = res.status;

                  q.resolve(ret);
                });
              });
            }
          }, 1);

          return q.promise;
        }
      };

      return Stor;
    })();

    return Stor;
  }
]);

l2c.factory('LessCompiler', [
    '$http'
  , 'Stor'

  , function($http, Stor) {
    var LessCache = new Stor('LessCache');

    var LessCompiler = (function() {
      LessCompiler.name = 'LessCompiler';

      function LessCompiler() {
        this.options = {
            saveLess : true
          , lessPath : "/javascripts/less/less-{version}.js"
        };

        this.defaults = _.cloneDeep(this.options);
        this.storage = LessCache;
      }

      LessCompiler.prototype = {
        initLess: function() {
          this.parser = new less.Parser(this.lessOptions);
        }

        , loadLess: function() {
          window.less = undefined;

          var opts = this.options
          , lessOptions = this.lessOptions
          , version = lessOptions.lessVersion;

          version = (version === lessOptions.preRelease)
            ? version + "-beta"
            : version;

          var scriptUrl = opts.lessPath.replace("{version}", version);

          return $.ajax({
              url      : scriptUrl
            , cache    : true
            , dataType : "script"
          });
        }

        , compileLess: function(lessCode) {
          try {
            var compiledCSS = this.parseLess(lessCode, this.lessOptions);
            this.error = false;

            return compiledCSS;
          } catch (lessEx) {
            this.error = true;
            return this.updateError(lessEx);
          }
        }

        , parseLess: function(lessCode) {
          var lessOptions = this.lessOptions
            , resultCss = "";

          this.parser.parse(lessCode, function(lessEx, result) {
            if (lessEx) throw lessEx;
            resultCss = result.toCSS(lessOptions);
          });

          return resultCss;
        }

        , updateOptions: function(options) {
          this.lessOptions = options;
          if (window.less) this.initLess();
        }

        , updateError: function(lessEx) {
          var errorText = (lessEx.type + ' error: ' + lessEx.message) + '\n' + (lessEx.extract && lessEx.extract.join && lessEx.extract.join(''));

          return errorText;
        }
      };

      return LessCompiler;
    })();

    return new LessCompiler();
  }
]);

l2c.directive('fadeShow', function() {
  function fadeShow(scope, elem, attrs) {
    var $elem = $(elem)
      , exp = attrs.fadeShow
      , duration = 400;

    fadeElem(scope.$eval(exp), true);

    scope.$watch(function() {
      return scope.$eval(exp);
    }, function(toShow) {
      fadeElem(toShow);
    });

    function fadeElem(toShow, init) {
      if (init == null) init = false;

      if (toShow) {
        $elem.fadeIn(duration);
      } else {
        init ? $elem.hide() : $elem.fadeOut(duration);
      }
    }
  }

  return fadeShow;
});
// Inspired by Angular-UI
l2c.directive('lessEditor', function() {
  return {
      restrict: 'A'
    , require: 'ngModel'

    , link: function(scope, elem, attrs, ngModel) {
      function deferCodeMirror() {
        var opts = scope[attrs.opts]
          , codeMirror = CodeMirror.fromTextArea(elem[0], opts);

        codeMirror.on('change', onChange(opts.onChange));

        ngModel.$render = function() {
          codeMirror.setValue(ngModel.$viewValue);
        };
      }

      function onChange() {
        return function(instance, changeObj) {
          var newValue = instance.getValue();

          if (newValue !== ngModel.$viewValue) {
            ngModel.$setViewValue(newValue);
            scope.$apply();
          }
        };
      }

      scope.$on('optionsLoaded', deferCodeMirror);
    }
  };
});

l2c.controller('Less2CssCtrl', [
    '$http'
  , '$scope'
  , 'Stor'
  , 'LessCompiler'

  , function($http, $scope, Stor, LessCompiler) {
    // Start req for options
    var getOptions = $http.get('/less-options'); // @todo Create service
    var LessCache = new Stor('LessCache');

    // Set model
    getOptions.success(function(options) {
      setOptions(options);
      setLessOptions(options);
      $scope.$emit('optionsLoaded');
      $scope.updateOptions();
      loadLess();
    });

    // Setup watchers
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

    // Set defaults
    // @todo Work this value getter into directive or JSON.
    // Boo on DOM query even if it's only initial
    $scope.lessInput = LessCache.get() || $('#less-input').val();
    $scope.cssOutput = '';
    $scope.rootpath = '';
    $scope.loading = false;
    $scope.legacyUnits = false;
    $scope.compileError = false;

    $scope.updateOptions = function() {
      var lessOpts = $scope.lessOptions;

      lessOpts.dumpLineNumbers = $scope.lineNumbersEnabled ? $scope.dumpLineNumbers : false;
      lessOpts.rootpath = $scope.rootPathEnabled ? $scope.rootpath : '';
      $scope.legacyUnits = !$scope.isLegacy() && $scope.legacyUnits ? true : false;
      lessOpts.strictMaths = lessOpts.strictUnits = $scope.legacyUnits ? false : true;
      LessCompiler.updateOptions(lessOpts);
    };

    $scope.toggleModel = function(model) {
      $scope[model] = !$scope[model];
      $scope.updateOptions();
    };

    $scope.toggleTxt = function(model) {
      return $scope[model] ? 'Enabled' : 'Disabled';
    };

    $scope.isLegacy = function() {
      // Oh shit, hard-coded numbers!
      return $scope.lessOptions
        ? parseFloat($scope.lessOptions.lessVersion, 10) < 1.4
        : false;
    };

    // Private fns
    function loadLess() {
      $scope.loading = true;
      var loading = LessCompiler.loadLess();

      loading.done(function() {
        $scope.$apply(function() {
          LessCompiler.initLess();
          compileLess();
          $scope.loading = false;
        });
      });
    }

    function compileLess() {
      $scope.cssOutput = LessCompiler.compileLess($scope.lessInput);
      $scope.compileError = LessCompiler.error;
      $scope.safeApply();
    }

    function setOptions(opts) {
      for (var k in opts) {
        $scope[k] = opts[k];
      }
    }

    function setLessOptions(opts) {
      _.each(opts.lessVersions, function(version) {
        if (version.type === 'current')
          $scope.lessOptions.lessVersion = version.number;

        if (version.type === 'pre')
          $scope.lessOptions.preRelease = version.number;
      });

      $scope.dumpLineNumbers = (function() {
        var sel = _.find(opts.lineNumberOptions, function(opt) {
          return !!opt["default"];
        });

        return sel.value;
      })();
    }
  }
]);
