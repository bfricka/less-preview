(function() {
  var app, express, http, less, mongo, routes, shortener;

  express = require('express');

  mongo = require('mongodb');

  http = require('http');

  less = require('less-middleware');

  routes = require('./routes');

  shortener = require('./shortener');

  app = express();

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
  });

  app.configure('development', function() {
    app.use(express["static"]("" + __dirname + "/public"));
    app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });

  app.configure('production', function() {
    app.use(express.staticCache());
    app.use(express["static"]("" + __dirname + "/public"));
    app.use(express.errorHandler({
      dumpExceptions: true
    }));
  });

  app.use(routes.fourOhfour);

  /*
  Begin Routes
  */


  app.get('/', routes.index);

  app.get('/less-options', routes.lessOptions);

  app.get('/share/:id([A-Za-z0-9]{1,6})', routes.share);

  /*
  Init
  */


  http.createServer(app).listen(app.get('port'), function() {
    return console.log("Server started on port " + (app.get('port')) + " in " + (app.get('env')) + " mode.");
  });

}).call(this);
