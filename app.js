(function() {
  var GitHubStrategy, app, express, fs, github, http, less, mongo, passport, routes, shortener;

  fs = require('fs');

  http = require('http');

  less = require('less-middleware');

  mongo = require('mongodb');

  routes = require('./routes');

  express = require('express');

  passport = require('passport');

  shortener = require('./express/shortener');

  GitHubStrategy = require('passport-github').Strategy;

  github = JSON.parse(fs.readFileSync('./github.json'));

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    done(null, obj);
  });

  passport.use(new GitHubStrategy({
    clientID: github.clientID,
    callbackURL: github.callbackURL,
    clientSecret: github.clientSecret
  }), function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  });

  app = express();

  app.locals.env = app.get('env');

  app.use(function(req, res, next) {
    var host;

    host = req.headers.host;
    if (host === "less2css.org") {
      return next();
    } else if (host === "www.less2css.org" || /(www\.)?(less2css\.com|preprocessors\.net)/i.test(host)) {
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
    app.use(express.logger());
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.session({
      secret: 'wtfyo'
    }));
    app.use(passport.initialize());
    app.use(passport.session());
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

  app.get('/auth/github', passport.authenticate('github'), function(req, res) {});

  app.get('/auth/github/callback', passport.authenticate('github', {
    failureRedirect: '/login'
  }), function(req, res) {
    return res.redirect('/');
  });

  app.get('/logout', function(req, res) {
    req.logout();
    return res.redirect('/');
  });

  app.get('/share/:id([A-Za-z0-9]{1,6})', routes.share);

  app.post('/compile', routes.compile);

  /*
  Init
  */


  http.createServer(app).listen(app.get('port'), function() {
    return console.log("Server started on port " + (app.get('port')) + " in " + (app.get('env')) + " mode.");
  });

}).call(this);
