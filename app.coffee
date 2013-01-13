express = require 'express'
routes  = require './routes'
http    = require 'http'
# path    = require 'path'
less    = require 'less-middleware'

app = express()

app.configure ->
  app.set 'port', process.env.PORT or 3000
  app.set 'views', "#{__dirname}/views"
  app.set 'view engine', 'jade'

  app.use express.favicon()
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use app.router
  app.use less({ src: "#{__dirname}/public"})
  app.use express.static("#{__dirname}/public")

  # Fall-through 404
  app.use (req, res) ->
    res.

# app.locals
#   title: "LESS2CSS"


http
.createServer(app)
.listen app.get('port'), ->
  console.log "Server started on port #{app.get('port')}"