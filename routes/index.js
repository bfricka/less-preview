var lessOpts = require('../express/less-options');

module.exports = {
  four_oh_four: function(req, res) {
    res.status(404);

    if (req.accepts('html')) return res.render("404", { app: '', title: 'LESS2CSS | 404' });
    if (req.accepts('json')) return res.send({ error: 'Not Found' });
    return res.type('txt').send('404 Not Found');
  },

  home: function(req, res) {
    var opts = { app: 'Less2Css', title : 'LESS2CSS | LESS Live Preview' };
    res.render('less2css', opts);
  },

  less_options: function(req, res) {
    res.json(lessOpts);
  }
};
