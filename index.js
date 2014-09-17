var sysPath  = require('path');
var coffeescript = require('coffee-script');

function CoffeeES6ModuleTranspiler(config) {
  if (config == null) config = {};
  var es6Cfg = config.plugins && config.plugins.es6ModuleTranspiler;
  var normalizeChecker = function(item) {
    switch (toString.call(item)) {
      case '[object RegExp]':
        return function(string) {
          return item.test(string);
        };
      case '[object Function]':
        return item;
      default:
        return function() {
          return false;
        };
    }
  };

  this.isVendor = normalizeChecker(config && config.conventions && config.conventions.vendor || null);
  this.sourceMaps = config.sourceMaps;
  this.match = new RegExp((es6Cfg && es6Cfg.match) || /.*/);
  this.wrapper = es6Cfg && es6Cfg.wrapper && ('to' + es6Cfg.wrapper.toUpperCase()) || 'toAMD';
  this.moduleName = es6Cfg && es6Cfg.moduleName;
  this.options = es6Cfg && es6Cfg.options || undefined;
};

CoffeeES6ModuleTranspiler.prototype.brunchPlugin = true;
CoffeeES6ModuleTranspiler.prototype.type = 'javascript';
CoffeeES6ModuleTranspiler.prototype.extension = 'coffee';
CoffeeES6ModuleTranspiler.prototype.pattern = /\.(coffee|coffee\.md|litcoffee)$/;
CoffeeES6ModuleTranspiler.prototype.transpiler = require('es6-module-transpiler-js-brunch').prototype.transpiler;
CoffeeES6ModuleTranspiler.prototype.compile = function(data, path, callback) {
  var options = {
    bare: true,
    sourceMap: this.sourceMaps,
    sourceFiles: [path],
    literate: /\.(litcoffee|coffee\.md)$/.test(path)
  };
  var compiled, e, result, ext, name;

  // STEP 1: compile coffee-script to javascript
  try {
    compiled = coffeescript.compile(data, options);
  } catch (e) {
    var error;
    error = e.location ? "" + e.location.first_line + ":" + e.location.first_column + " " + (e.toString())
                              : e.toString();
    return callback(error);
  }

  // prepare interim brunch result
  result = compiled && options.sourceMap  ? { data: compiled.js, map: compiled.v3SourceMap }
                                          : { data: compiled };

  if (this.match.test(path)) {
    // STEP 2: transpile javascript
    ext = sysPath.extname(path);
    name = sysPath.join(sysPath.dirname(path), sysPath.basename(path, ext)).replace(/[\\]/g, '/');
    if (this.moduleName) name = this.moduleName(name);
    try {
      result.data = new this.transpiler(result.data, name, this.options)[this.wrapper]();
    } catch (e) {
      return callback(e.toString());
    }
  }
  return callback(null, result);
};

module.exports = CoffeeES6ModuleTranspiler;
