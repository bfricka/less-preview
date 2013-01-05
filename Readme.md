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

---
Please feel free to contribute or suggest features and improvements.