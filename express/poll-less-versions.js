var Stopwatch = require('stopwatch-emitter').Stopwatch;
var stopwatch = new Stopwatch('10m');

stopwatch.on('start', pollVersions);
stopwatch.on('restart', pollVersions);

function pollVersions() {

}
