(function() {

  exports.lessOpts = {
    lessVersions: [
      {
        label: "1.4.0 (beta)",
        number: "1.4.0",
        type: "pre"
      }, {
        label: "1.3.3 (current)",
        number: "1.3.3",
        type: "current"
      }, {
        label: "1.3.2",
        number: "1.3.2",
        type: "old"
      }, {
        label: "1.3.1",
        number: "1.3.1",
        type: "old"
      }, {
        label: "1.3.0",
        number: "1.3.0",
        type: "old"
      }, {
        label: "1.2.2",
        number: "1.2.2",
        type: "old"
      }, {
        label: "1.2.1",
        number: "1.2.1",
        type: "old"
      }, {
        label: "1.2.0",
        number: "1.2.0",
        type: "old"
      }, {
        label: "1.1.6",
        number: "1.1.6",
        type: "old"
      }, {
        label: "1.1.5",
        number: "1.1.5",
        type: "old"
      }, {
        label: "1.1.4",
        number: "1.1.4",
        type: "old"
      }, {
        label: "1.1.3",
        number: "1.1.3",
        type: "old"
      }, {
        label: "1.1.2",
        number: "1.1.2",
        type: "old"
      }, {
        label: "1.1.1",
        number: "1.1.1",
        type: "old"
      }, {
        label: "1.1.0",
        number: "1.1.0",
        type: "old"
      }
    ],
    lessOptions: {
      dumpLineNumbers: false,
      relativeUrls: false,
      strictMaths: true,
      strictUnits: true,
      rootpath: false,
      filename: "less2css.org.less"
    },
    lessEditorOptions: {
      theme: "lesser-dark",
      tabSize: 2,
      lineNumbers: true,
      matchBrackets: true
    },
    cssEditorOptions: {
      theme: "lesser-dark",
      tabSize: 2,
      readOnly: true,
      lineNumbers: true,
      matchBrackets: true
    },
    lineNumberOptions: [
      {
        label: "Comments",
        value: "comments",
        "default": true
      }, {
        label: "Media Query",
        value: 'mediaquery'
      }, {
        label: "All",
        value: 'all'
      }
    ]
  };

}).call(this);
