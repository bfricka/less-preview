(function() {
  var app, express, http, less, mongoose;

  express = require('express');

  mongoose = require('mongoose');

  http = require('http');

  less = require('less-middleware');

  app = express();

  app.locals.lessVersions = require('./public/javascripts/lessVersions')['lessVersions'];

  app.locals.env = app.get('env');

  app.use(function(req, res, next) {
    var host;
    host = req.headers.host;
    if (host === "less2css.org") {
      return next();
    } else if (host === "www.less2css.com" || host === "www.less2css.org" || host === "less2css.com") {
      return res.redirect(301, "http://less2css.org" + req.url);
    } else {
      return next();
    }
  });

  /*
  Begin config
  */


  app.configure(function() {
    app.set('port', 3000);
    app.set('views', "" + __dirname + "/views");
    app.set('view engine', 'jade');
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(less({
      src: "" + __dirname + "/public",
      compress: true
    }));
    app.use(express.staticCache());
    app.use(express["static"]("" + __dirname + "/public"));
    app.use(function(req, res) {
      res.status(404);
      if (req.accepts('html')) {
        return res.render("404", {
          title: 'LESS2CSS | 404'
        });
      } else if (req.accepts('json')) {
        return res.send({
          error: 'Not Found'
        });
      } else {
        return res.type('txt').send('404 Not Found');
      }
    });
  });

  /*
  Begin Routes
  */


  app.get('/', function(req, res) {
    var opts;
    opts = {
      title: 'LESS2CSS | LESS Live Preview',
      app: 'Less2Css'
    };
    return res.render('less2css', opts);
  });

  /*
  Init
  */


  http.createServer(app).listen(app.get('port'), function() {
    return console.log("Server started on port " + (app.get('port')) + " in " + (app.get('env')) + " mode.");
  });

}).call(this);
