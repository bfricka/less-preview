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
    '$timeout', function($timeout) {
      return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attrs, ngModel) {
          var deferCodeMirror, onChange, opts;
          opts = scope[attrs.opts] || {};
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
            var codeMirror;
            codeMirror = CodeMirror.fromTextArea(elem[0], opts);
            codeMirror.on('change', onChange(opts.onChange));
            ngModel.$render = function() {
              codeMirror.setValue(ngModel.$viewValue);
            };
          };
          return $timeout(deferCodeMirror);
        }
      };
    }
  ]);

  l2c.factory('LessCompiler', function(options) {});

  l2c.controller('Less2CssCtrl', [
    '$scope', function($scope) {
      var stor;
      stor = new Stor("lessCode");
      $scope.lessEditorOpts = {
        theme: "lesser-dark",
        tabSize: 2,
        lineNumbers: true,
        matchBrackets: true
      };
      $scope.cssEditorOpts = (function() {
        var opts;
        opts = angular.copy($scope.lessEditorOpts);
        opts.readOnly = true;
        return opts;
      })();
      $scope.cssOutput = 'a.cool { display: none; }';
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
      $scope.lessInput = document.getElementById('lessInput').value;
      return $scope.dumpLineNumbers = "comments";
    }
  ]);

}).call(this);
