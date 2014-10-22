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
      vendor: [ js + '/vendor.min.js' ],
      app: [ js + '/less2css.min.js' ]
    };
  },

  development: function() {
    var js = this.jsPath;

    return {
      vendor: [
        js + '/vendor/angular.js',
        js + '/vendor/lodash.js',
        js + '/vendor/cm/codemirror.js',
        js + '/vendor/cm/addon/edit/closebrackets.js',
        js + '/vendor/cm/addon/edit/matchbrackets.js',
        js + '/vendor/cm/mode/less/less.js'
      ],
      app: [
        js + '/src/base-extenders.js',
        js + '/src/lodash-extenders.js',
        js + '/src/Stor/Stor.js',
        js + '/src/Stor/angular-stor.js',
        js + '/src/TransitionHelper/TransitionHelper.js',
        js + '/src/Less2Css/less2css.js',
        js + '/src/Less2Css/services/LessLoader.js',
        js + '/src/Less2Css/services/LessOptions.js',
        js + '/src/Less2Css/services/LessCompiler.js',
        js + '/src/Less2Css/directives/lessEditor.js',
        js + '/src/Less2Css/directives/drawer.js',
        js + '/src/Less2Css/controllers/AppCtrl.js',
        js + '/src/Less2Css/controllers/OptionsCtrl.js',
        js + '/src/Less2Css/controllers/Less2CssCtrl.js'
      ]
    };
  },

  testUnit: function() {
    var dev = this.development();

    var testUnit = [].concat(dev.vendor, dev.app);
    testUnit.push(this.basePath + '/test/unit/**/*.spec.js');

    return testUnit;
  },

  getScriptSrc: function(env) {
    var scripts = this[env]();
    var combined = scripts.vendor.concat(scripts.app);
    var len = combined.length;
    var i = 0;

    while (i < len) {
      combined[i] = combined[i].replace(this.jsPath, '/javascripts');
      i++;
    }

    return combined;
  }
};

module.exports = Scripts;
