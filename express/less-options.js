require('./less-versions')(function(err, results) {
  module.exports.versions = results;
});

module.exports = {
  versions: [],
  options: {
    filename        : 'less2css.org.less',
    rootpath        : false,
    strictUnits     : false,
    strictMath      : false,
    relativeUrls    : false,
    dumpLineNumbers : false
  },

  lessEditorOptions: {
    theme             : 'lesser-dark',
    tabSize           : 2,
    lineNumbers       : true,
    matchBrackets     : true,
    autoCloseBrackets : true
  },

  cssEditorOptions: {
    theme         : 'lesser-dark',
    tabSize       : 2,
    readOnly      : true,
    lineNumbers   : true,
    matchBrackets : true
  },

  lineNumberOptions: [
    { label: 'Comments', value: 'comments', 'default': true },
    { label: 'Media Query', value: 'mediaquery' },
    { label: 'All', value: 'all' }
  ]
};
