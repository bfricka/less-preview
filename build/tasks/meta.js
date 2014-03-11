module.exports = function(grunt, locals) {
  grunt.mergeConfig({
    pkg: grunt.file.readJson('package.json'),
    meta: {
      banner: [
        '/* <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.homepage %>',
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>. All rights reserved.',
        ' * Licensed <%= _.pluck(pkg.licenses, "type")[0] %> - <%= _.pluck(pkg.licenses, "url")[0] %>',
        ' */',
        ''
      ].join('\n')
    }
  });
};