module.exports = {
    versions: [
    { label: "1.7.5", number: "1.7.5", type: "current" },
    { label: "1.7.4", number: "1.7.4", type: "old" },
    { label: "1.7.3", number: "1.7.3", type: "old" },
    { label: "1.7.2", number: "1.7.2", type: "old" },
    { label: "1.7.1", number: "1.7.1", type: "old" },
    { label: "1.7.0", number: "1.7.0", type: "old" },
    { label: "1.6.3", number: "1.6.3", type: "old" },
    { label: "1.6.2", number: "1.6.2", type: "old" },
    { label: "1.6.1", number: "1.6.1", type: "old" },
    { label: "1.6.0", number: "1.6.0", type: "old" },
    { label: "1.5.1", number: "1.5.1", type: "old" },
    { label: "1.5.0", number: "1.5.0", type: "old" },
    { label: "1.4.2", number: "1.4.2", type: "old" },
    { label: "1.4.1", number: "1.4.1", type: "old" },
    { label: "1.4.0", number: "1.4.0", type: "old" },
    { label: "1.3.3", number: "1.3.3", type: "old" },
    { label: "1.3.2", number: "1.3.2", type: "old" },
    { label: "1.3.1", number: "1.3.1", type: "old" },
    { label: "1.3.0", number: "1.3.0", type: "old" },
    { label: "1.2.2", number: "1.2.2", type: "old" },
    { label: "1.2.1", number: "1.2.1", type: "old" },
    { label: "1.2.0", number: "1.2.0", type: "old" },
    { label: "1.1.6", number: "1.1.6", type: "old" },
    { label: "1.1.5", number: "1.1.5", type: "old" },
    { label: "1.1.4", number: "1.1.4", type: "old" },
    { label: "1.1.3", number: "1.1.3", type: "old" },
    { label: "1.1.2", number: "1.1.2", type: "old" },
    { label: "1.1.1", number: "1.1.1", type: "old" },
    { label: "1.1.0", number: "1.1.0", type: "old" }
  ],

  options: {
    filename        : "less2css.org.less",
    rootpath        : false,
    strictUnits     : false,
    strictMath      : false,
    relativeUrls    : false,
    dumpLineNumbers : false
  },

  lessEditorOptions: {
    theme             : "lesser-dark",
    tabSize           : 2,
    lineNumbers       : true,
    matchBrackets     : true,
    autoCloseBrackets : true
  },

  cssEditorOptions: {
    theme         : "lesser-dark",
    tabSize       : 2,
    readOnly      : true,
    lineNumbers   : true,
    matchBrackets : true
  },

  lineNumberOptions: [
    { label: "Comments", value: "comments", "default": true },
    { label: "Media Query", value: 'mediaquery' },
    { label: "All", value: 'all' }
  ]
};
