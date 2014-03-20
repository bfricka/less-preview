var q = require('q');
var path = require('path');
var exec = require('child_process').exec;

exec('git tag', {
  cwd: path.join(__dirname, '../less')
}, function(err, stdout, stderr) {
  if (err) {
    var errorMsg = ["Ummm, some issues w/ getting tags", err, stderr].join('\n');
    console.error(errorMsg);
    process.exit(0);
  }

  var tags = stdout.split('\n');
  console.log(tags);
});