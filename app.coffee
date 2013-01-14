express  = require 'express'
mongoose = require 'mongoose'
http     = require 'http'
# path   = require 'path'
less     = require 'less-middleware'

app = express()

app.locals.lessVersions = require('./public/javascripts/lessVersions')['lessVersions']

app.configure ->
  app.set 'port', process.env.PORT or 3000
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'

  app.use express.compress()
  app.use express.favicon()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use less({ src: "#{__dirname}/public"})
  app.use express.static("#{__dirname}/public")

  # Fall-through 404
  app.use (req, res) ->
    res.status(404)

    if req.accepts('html')
      res.render "404", { title: 'LESS2CSS | 404' }

    else if req.accepts('json')
      res.send { error: 'Not Found' }

    else
      res.type('txt').send '404 Not Found'

# mongoose.connect "mongodb://localhost/less2css"

app.get '/', (req, res) ->
  res.render 'less2css', {title: 'LESS2CSS | LESS Live Preview'}

http
.createServer(app)
.listen app.get('port'), ->
  console.log "Server started on port #{app.get('port')}"