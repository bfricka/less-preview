var _ = require('lodash');
var fs = require('fs');
var gulpRegex = /^gulp-/;
var camelRegex = /[-_]\w{1}/g;

/**
 * strip gulp- and camelCase
 * @param  {string} str - String to camelize
 * @return {string}
 */
function gulpCamelCase(str) {
  return str
    .replace('gulp-', '')
    .replace(camelRegex, function(match) {
      return match.substr(1).toUpperCase();
    });
}

var pkg = JSON.parse(fs.readFileSync('./package.json'));
var plugins = {};

_.chain({})
  .merge(pkg.dependencies || {}, pkg.devDependencies || {})
  .keys()
  .filter(function(key) { return gulpRegex.test(key) })
  .forEach(function(plugin) {
    plugins[gulpCamelCase(plugin)] = require(plugin);
  });

module.exports = plugins;
