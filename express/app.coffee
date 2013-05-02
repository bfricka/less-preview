fs             = require 'fs'
http           = require 'http'
less           = require 'less-middleware'
mongo          = require 'mongodb'
routes         = require './routes'
express        = require 'express'
passport       = require 'passport'
shortener      = require './express/shortener'
GitHubStrategy = require('passport-github').Strategy

github = JSON.parse fs.readFileSync('./github.json')

passport.serializeUser (user, done) ->
  done null, user
  return

passport.deserializeUser (obj, done) ->
  done null, obj
  return

passport.use(
  new GitHubStrategy(
    clientID     : github.clientID
    callbackURL  : github.callbackURL
    clientSecret : github.clientSecret
  )
  , (accessToken, refreshToken, profile, done) ->
    process.nextTick ->
      done null, profile
    return
)

app = express()
app.locals.env = app.get('env')

# Perform canonicalization
app.use (req, res, next) ->
  host = req.headers.host
  if host is "less2css.org" # Quick next for canonical
    next()
  else if host is "www.less2css.org" or
  /(www\.)?(less2css\.com|preprocessors\.net)/i.test(host)
    res.redirect 301, "http://less2css.org#{req.url}"
  else # For localhost
    next()

###
Begin config
###
app.configure ->
  app.set 'port', 3000
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'

  # Enable Gzip
  app.use express.compress()
  # Enable utility middleware
  app.use express.logger()
  app.use express.cookieParser()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.session { secret: 'wtfyo' }
  app.use passport.initialize()
  app.use passport.session()
  app.use app.router
  app.use( less src: "#{__dirname}/public", compress: true )
  return

app.configure 'development', ->
  app.use express.static("#{__dirname}/public")
  app.use( express.errorHandler dumpExceptions: true, showStack: true )
  return

app.configure 'production', ->
  # Use static cache for now until I find something better
  app.use express.staticCache()
  app.use express.static("#{__dirname}/public")
  app.use( express.errorHandler dumpExceptions: true )
  return

# Fall-through 404
app.use routes.fourOhfour

###
Begin Routes
###
app.get '/', routes.index
app.get '/less-options', routes.lessOptions

app.get(
  '/auth/github',
  passport.authenticate('github'),
  (req, res) ->
)

app.get(
  '/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login'}),
  (req, res) ->
    res.redirect('/')
)

app.get '/logout', (req, res) ->
  req.logout()
  res.redirect('/')

app.get '/share/:id([A-Za-z0-9]{1,6})', routes.share

app.post '/compile', routes.compile

###
Init
###
http
  .createServer(app)
  .listen app.get('port'), ->
    console.log "Server started on port #{app.get('port')} in #{app.get('env')} mode."