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
