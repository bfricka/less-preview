var http           = require('http')
  , less           = require('less-middleware')
  , mongo          = require('mongodb')
  , routes         = require('./routes')
  , express        = require('express')
  , passport       = require('passport')
//  , shortener      = require('./express/shortener')
  , appConfig      = require('./private').app
  , GitHubStrategy = require('passport-github').Strategy
  , githubConfig   = require('./private').github;

var app = express();
http.createServer(app);

app.locals.env = app.get('env');

app.locals.scripts = (function(){
  var cwd = process.cwd()
    , scripts = require('./express/app-scripts')(cwd);

  return scripts.getScriptSrc(app.get('env'));
}());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy({
      clientID: githubConfig.clientID
    , callbackURL: githubConfig.callbackURL
    , clientSecret: githubConfig.clientSecret
  })
  , function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {
      return done(null, profile);
    });
  }
);

// Perform canonicalization
app.use(function(req, res, next) {
  var host = req.headers.host;

  if (host === 'less2css.org') {
    next(); // Quick next for canonical
  } else if (host === 'www.less2css.org' || /(www\.)?(less2css\.com|preprocessors\.net)/i.test(host)) {
    res.redirect(301, 'http://less2css.org' + req.url);
  } else {
    next();
  }
});

// Begin config
app.configure('all', function() {
  app.set('port', '3000');
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.compress());
  app.use(express.logger());
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session({
    secret: appConfig.secretKey
  }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.use(less({
      src: __dirname + '/public'
    , compress: true
  }));
});

app.configure('development', function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({
      showStack: true
    , dumpExceptions: true
  }));
});

app.configure('production', function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true }));
});

app.use(routes.fourOhfour);

// Begin Routes


app.get('/', routes.home);
app.get('/less-options', routes.lessOptions);
app.get('/auth/github', passport.authenticate('github'), function(req, res) {});
app.get('/auth/github/callback'
  , passport.authenticate('github', { failureRedirect: '/login' })
  , function(req, res) { return res.redirect('/'); }
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/share/:id([A-Za-z0-9]{1,6})', routes.share);
app.post('/compile', routes.compile);

// Init
app.listen(app.get('port'), function(){
  console.log("Server started on port " + app.get('port') + ' in ' + app.get('env') + ' mode.');
});
