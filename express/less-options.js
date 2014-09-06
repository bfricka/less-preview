var _ = require('lodash');
var bower = require('bower');
var semver = require('semver');

var versionsExports = [];

bower.commands.info('less').on('end', function(results) {
  if (results && _.isEmpty(results.versions)) {
    return;
  }

  var versions = results.versions
    .sort(semver.compare)
    .reverse();

  var latestVersion = results.latest.version;
  var highestVersion = _.first(versions);
  var hasBeta = semver.neq(latestVersion, highestVersion);

  module.exports.versions = _.chain(results.versions)
    .filter(filterExraneousBetas)
    .map(createVersionModels)
    .value();

  function filterExraneousBetas(version, i, arr) {
    var p = semver.parse(version);

    if (semver.lt(version, '1.3.0')) {
      return false;
    }

    var mainVersion = [p.major, p.minor, p.patch].join('.');

    if (p.prerelease.length) {
      return !_.contains(arr, mainVersion);
    }

    return version;
  }

  function labelSuffix(type) {
    return type == 'current'
      ? ' ('+ type +')'
      : type == 'pre'
      ? ' (beta)'
      : '';
  }

  function createVersionModels(version) {
    var type = getVersionType(version);

    return {
      type: type,
      label: version + labelSuffix(type),
      number: version
    };
  }

  function getVersionType(version) {
    if (version === latestVersion) {
      return 'current';
    }

    if (hasBeta && version === highestVersion) {
      return 'pre';
    }

    return 'old';
  }
});

module.exports = {
  versions: [],

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
