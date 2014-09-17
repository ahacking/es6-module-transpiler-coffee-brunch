# es6-module-transpiler-coffee-brunch

Adds ES6 module transpiling for legacy coffee-script [Brunch](http://brunch.io) using Square's [es6-module-transpiler](https://github.com/square/es6-module-transpiler).

The **ES6 Module Transpiler** is an experimental compiler that allows you to write your JavaScript using a subset of the current ES6 module syntax, and compile it into AMD or CommonJS modules.

**Note:** This plugin is the companion to [es6-module-transpiler-js-brunch](https://github.com/ahacking/es6-module-transpiler-js-brunch) but for coffee-script and is a replacement for [coffee-script-brunch]()https://github.com/brunch/coffee-script-brunch).

**Warning: In my limited testing the ES6 module transpiler currently doesn't emit anything useful for typical CommonJS interoperability, so its effectively only useful for AMD.

## Motivation
I am currently using this plugin to provide ember-cli equivalent ES6 module transpiling for coffees-cript but using brunch instead of ember-cli/broccoli because of performance regressions (as at 14 Sep 2014) render it unusable.  This shares the same configuration options as es6-module-transpiler-js.

This plugin is intended more as a stop-gap measure to allow use of newer ES6 features in Javascript within a mixed code-base that also contains legacy coffee-script code.

## Installation
Install the plugin via npm with `npm install --save es6-module-transpiler-coffee-brunch`.

Or, do manual install:

* Add `"es6-module-transpiler-coffee-brunch": "x.y.z"` to `package.json` of your brunch app.
* If you want to use git version of plugin, add
`"es6-module-transpiler-coffee-brunch": "git+ssh://git@github.com:ahacking/es6-module-transpiler-coffee-brunch.git"`.

**Your coffee-script source must use backticks to escape ES6 module syntax, since coffee-script is unable to follow the direction of where Javascript is heading.**

```coffeescript
`import Animal from 'animal';`

class Snake extends Animal
  move: ->
    alert "Slithering..."
    super 5

`export default Snake;`
```

## How the plugin works
The plugin will take all files ending in `*.coffee` under the `app` directory and passes them first through `coffee-script` and then `es6-module-transpiler` into a module based on your configured wrapper, (AMD by default).


## Configuration

The plugin has the following transpiler configuration options you can add to your project's `config.coffee`:
* `match` is a regex used to decide what files to transpile,
* `wrapper` specifies the module wrapper, eg 'amd' or cjs' (default) supported.
* `moduleName` a function that can be used to map module names as required.
* `options` options to pass through verbatim to `es6-module-transpiler`.

**It is important to disable the brunch module wrapper when using AMD as it interferes with the module wrapping performed by this plugin.**

**You must not use the coffee-script-brunch plugin as this plugin replaces its functionality.** Simply remove it from package.json and run ``npm prune``.

```coffeescript
exports.config = 
  modules:
    wrapper: false
  plugins:
    es6ModuleTranspiler:
      wrapper: 'amd'
      moduleName: (path)-> 'namespace/' + path
      options:
        imports:
          underscore: '_'
        global: 'RSVP'
```

If you are using ``coffeelint-brunch`` you will need to ignore backticks warnings:
```coffeescript
  plugins:
    coffeelint:
      options:
        no_backticks:
          level: "ignore"

```


