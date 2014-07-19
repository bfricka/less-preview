var _ = require('lodash');
var slugRegex = /\{\{(.+)\}\}/;

var dirs = {
  src: {
    less        : './less.js',
    images      : './src/images',
    styles      : './src/stylesheets',
    vendor      : './src/vendor',
    modules     : './src/modules'
  },

  dest: {
    base        : './public',
    images      : './public/images',
    styles      : './public/styles',
    javascripts : './public/javascripts'
  }
};

/**
 * Match dir slug and replace from object
 * @param  {string} str - Path w/ slug
 * @return {string}     - Replaced path
 */
function d(str) {
  var match = ('' + str).match(slugRegex);
  if (!match) throw new Error('Your suck testicles!');

  var obj = dirs;
  var split = match[1].split('.');
  var val;

  _.forEach(split, function(key, i) {
    key = split[i].trim();
    val = obj[key];
    if (_.isString(val)) return false;
    obj = val;
  });

  return str.replace(slugRegex, val);
}

_.extend(d, dirs);
module.exports = d;
