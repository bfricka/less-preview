/* jshint undef: false */

function Scripts(basePath) {
  if (!(this instanceof Scripts)) return new Scripts(basePath);

  this.basePath = basePath;
  this.jsPath = basePath + '/public/javascripts';
}

Scripts.prototype = {
  production: function() {
    var js = this.jsPath;

    return {
        vendor: [ js + '/vendor.min.js' ]
      , app: [ js + '/less2css.min.js' ]
    };
  }

  , development: function() {
    var js = this.jsPath;

    return {
      vendor: [
          js + '/vendor/jquery.js'
        , js + '/vendor/angular.js'
        , js + '/vendor/amplify.store.js'
        , js + '/vendor/lodash.js'
        , js + '/vendor/cm/codemirror.js'
        , js + '/vendor/cm/util/matchbrackets.js'
        , js + '/vendor/cm/mode/less/less.js'
      ]
      , app: [
          js + '/plugins/Element.js'
        , js + '/app/app.js'
        , js + '/app/services/Stor.js'
        , js + '/app/services/LessCompiler.js'
        , js + '/app/services/Animate.js'
        , js + '/app/directives/fadeShow.js'
        , js + '/app/directives/lessEditor.js'
        , js + '/app/directives/drawer.js'
        , js + '/app/controllers/Less2CssCtrl.js'
      ]
    };
  }

  , testUnit: function() {
    var dev = this.development();

    var testUnit = [].concat(dev.vendor, dev.app);
    testUnit.push(this.basePath + '/test/unit/**/*.spec.js');

    return testUnit;
  }

  , getScriptSrc: function(env) {
    var scripts = this[env]()
    , combined = scripts.vendor.concat(scripts.app)
    , len = combined.length
    , i = 0;

    while (i < len) {
      combined[i] = combined[i].replace(this.jsPath, '/javascripts');
      i++;
    }

    return combined;
  }
};

module.exports = Scripts;