var Stopwatch = require('stopwatch-emitter').Stopwatch;
var stopwatch = new Stopwatch('10m');
var lessVersions = require('./less-versions');

stopwatch.on('start', pollVersions);
stopwatch.on('restart', pollVersions);

function pollVersions() {
  lessVersions().then();
}
