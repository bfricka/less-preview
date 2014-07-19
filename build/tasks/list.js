var util = require('util');
var plugins = require('../gulp-plugins');

module.exports = function() {
  console.log(util.inspect(plugins, { colors: true, depth: null }));
};