# LESS2CSS | Live LESS Preview

[LESS](http://lesscss.org/) is a popular CSS pre-processor. Used on the [Twitter Bootstrap](https://twitter.gitub.com/bootstrap/) project and on many others, LESS makes CSS more powerful by giving designers and developers access to [variables](http://lesscss.org/#-variables), [mixins](http://lesscss.org/#-mixins), [functions](http://lesscss.org/#-functions), [string interpolation](http://lesscss.org/#-string-interpolation), [imports](http://lesscss.org/#-importing), and many other features.

## Debugging

LESS Previewer was cooked us as a way to visualize LESS output quickly by running it directly through the LESS processor. This allows you to test various version of LESS and their support (or lack thereof) of the syntax you are using.

Because LESS has very different levels of support for certain syntax depending on the version, it's often nice to be able to test this directly.

For example selector interpolation like this only works in 1.3.1+

```less
@mySelector: home-base;

.@{mySelector} {
  display: block;
}
```

## Contributing

### Style

If needed a style-guide will be created for contributors. In the meantime, if you'd like to contribute, please take care to follow the general style of the project.

### Requirements for building & running

- [Node.js](http://nodejs.org/)
- [MongoDB](http://www.mongodb.org/) (coming soon)

### Building

1. Install [grunt-cli](https://github.com/gruntjs/grunt/wiki/Getting-started): `$ [sudo] npm install -g grunt-cli`.
2. Install [express](http://expressjs.com/): `$ [sudo] npm install -g express`
3. Install dependencies *(from root project folder)*: `$ npm install`
4. Run [Grunt](http://gruntjs.com/) *(from root project folder)*: `$ grunt`
5. Start the app: `$ npm start`. This will start the app on http://localhost:3000/. [Nodemon](https://github.com/remy/nodemon) will restart the server automatically when it detects a change.
6. Open a new terminal tab or window and start the [watcher](https://github.com/gruntjs/grunt-contrib-watch) task: `$ grunt watch`. This will compile coffee-script to js, run [jshint](http://jshint.com/) on the output, and [minify](https://github.com/mishoo/UglifyJS) the files, and run all unit tests.

---
Please feel free to contribute or suggest features and improvements.