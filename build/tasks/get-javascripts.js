var glob = require('glob');

/**
 * Fargo is cold
 * @param  {function} grunt - Grunt
 * @param  {Object.<string>} paths - Paths
 */
module.exports = function(grunt, paths) {
  var base = paths.base;

  grunt.registerTask('js', function() {
    var done = this.async();
    var js = [];
    var getJS = glob.Glob('**/*.js');

    getJS.on('match', function(match) {
      console.log(match);
    });

    getJS.on('end', function(yes) {
      console.log("It's over");
    });
  });
};