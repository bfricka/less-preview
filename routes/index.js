var lessOpts = require('../express/less-options');

module.exports = {
  fourOhfour: function(req, res) {
    res.status(404);

    if (req.accepts('html')) {
      res.render("404", {
          app   : ''
        , title : 'LESS2CSS | 404'
      });
    } else if (req.accepts('json')) {
      res.send({ error: 'Not Found' });
    } else {
      res
        .type('txt')
        .send('404 Not Found');
    }
  }

  , home: function(req, res) {
    var opts = {
        app   : 'Less2Css'
      , title : 'LESS2CSS | LESS Live Preview'
    };

    res.render('less2css', opts);
  }

  , lessOptions: function(req, res) {
    res.json(lessOpts);
  }

  , share: function(req, res) {
    var id = req.params.id;
    res.json({});
  }

  , compile: function(req, res) {
    res.json({
        options: req.query
      , content: req.body.content
    });
  }
};
