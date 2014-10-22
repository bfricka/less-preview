var q = require('q');
var _ = require('lodash');
var bower = require('bower');
var semver = require('semver');

_.mixin({
  reflect: function(arg) {
    return arg;
  },

  ret: function(arg) {
    return function() {
      return arg;
    };
  }
});

module.exports = function getVersions(cb) {
  cb = cb || _.noop;
  var deferred = q.defer();
  var promise = deferred.promise;

  if (typeof cb != 'function') {
    throw new TypeError('Callback '+ cb +' should be a function.');
  }

  bower.commands.info('less')
    .on('end', _.partial(handleResults, cb, deferred))
    .on('error', function(err) {
      cb(err);
      deferred.reject(err);
    });

  return promise;
};

var hasBeta;
var minVersion = '1.3.0';
var latestVersion;
var highestVersion;

function handleResults (cb, deferred, results) {
  if (results && _.isEmpty(results.versions)) {
    return null;
  }

  var versions = results.versions
    .sort(semver.compare)
    .reverse();

  latestVersion = results.latest.version;
  highestVersion = _.first(versions);
  hasBeta = semver.neq(latestVersion, highestVersion);

  versions = _.chain(versions)
    .filter(notLessThanMin)
    .filter(noExtraneousBetas)
    .map(createVersionModels)
    .value();

  cb(null, versions);
  deferred.resolve(versions);

  return versions;
}

function mainVersion(p) {
  return [p.major, p.minor, p.patch].join('.');
}

function notLessThanMin(version) {
  return semver.gte(version, minVersion);
}

function doesntHaveVersion(arr, p) {
  return !_.contains(arr, mainVersion(p));
}

function noExtraneousBetas(version, i, arr) {
  var p = semver.parse(version);
  return _.isEmpty(p.prerelease) || doesntHaveVersion(arr, p);
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
  if (version == latestVersion) {
    return 'current';
  }

  if (hasBeta && version == highestVersion) {
    return 'pre';
  }

  return 'old';
}
