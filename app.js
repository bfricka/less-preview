var app, express, http, less, mongoose;

express = require('express');

mongoose = require('mongoose');

http = require('http');

less = require('less-middleware');

app = express();

app.locals.lessVersions = require('./public/javascripts/lessVersions')['lessVersions'];

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

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
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

app.get('/', function(req, res) {
  return res.render('less2css', {
    title: 'LESS2CSS | LESS Live Preview'
  });
});

app.get('/test', function(req, res) {
  return res.send(req.headers.host + req.url);
});

http.createServer(app).listen(app.get('port'), function() {
  return console.log("Server started on port " + (app.get('port')));
});
