(function() {
  var lessCompiler, lessOpts;

  lessOpts = require('../express/less-options')['lessOpts'];

  lessCompiler = require('../express/less-express-compiler');

  exports.fourOhfour = function(req, res) {
    res.status(404);
    if (req.accepts('html')) {
      return res.render("404", {
        title: 'LESS2CSS | 404',
        app: ''
      });
    } else if (req.accepts('json')) {
      return res.send({
        error: 'Not Found'
      });
    } else {
      return res.type('txt').send('404 Not Found');
    }
  };

  exports.index = function(req, res) {
    var opts;
    opts = {
      title: 'LESS2CSS | LESS Live Preview',
      app: 'Less2Css'
    };
    return res.render('less2css', opts);
  };

  exports.lessOptions = function(req, res) {
    return res.json(lessOpts);
  };

  exports.share = function(req, res) {
    var id;
    id = req.params.id;
    return res.json({});
  };

  exports.compile = function(req, res) {
    return res.json({
      options: req.query,
      content: req.body.content
    });
  };

}).call(this);
