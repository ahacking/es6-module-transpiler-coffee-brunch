var expect = require('chai').expect;
var Plugin = require('./');

describe('Plugin', function() {
  var plugin;

  beforeEach(function() {
    plugin = new Plugin({});
  });

  it('should be an object', function() {
    expect(plugin).to.be.ok;
  });

  it('should has #compile method', function() {
    expect(plugin.compile).to.be.an.instanceof(Function);
  });

  it('should compile and produce valid result', function(done) {
    var content = 'a = 1';
    var expected = 'define("file",\n  [],\n  function() {\n    "use strict";\n    var a;\n\n    a = 1;\n  });';
    plugin.compile(content, 'file.coffee', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      done();
    });
  });

  it('should compile literal source and produce valid result', function(done)
  {
    var content = 'I am a literal string\n\n    a = 1';
    var expected = 'define("file",\n  [],\n  function() {\n    "use strict";\n    var a;\n\n    a = 1;\n  });';

    plugin.compile(content, 'file.litcoffee', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      done();
    });
  });

  it('should produce source maps', function(done) {
    plugin = new Plugin({sourceMaps: true});

    var content = 'a = 1';
    var expected = 'define("file",\n  [],\n  function() {\n    "use strict";\n    var a;\n\n    a = 1;\n  });';
    plugin.compile(content, 'file.coffee', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      expect(data.map).to.be.a('string');
      done();
    });
  });

  it('should generate AMD dependencies and exports', function(done) {
    var content = '`import foo from "bar";`\na = 1\n`export default = a;`';
    var expected = 'define("file",\n  ["bar","exports"],\n  function(__dependency1__, __exports__) {\n    "use strict";\n    var foo = __dependency1__["default"];\n\n    var a;\n\n    a = 1;\n\n    __exports__["default"] = a;;\n  });';

    plugin.compile(content, 'file.coffee', function(error, data) {
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      done();
    });
  });

  it('should produce CJS module wrapper', function(done) {
    plugin = new Plugin({plugins: { es6ModuleTranspiler: { wrapper: 'cjs'}}});

    var content = '`import foo from "bar";`\na = 1\n`export default = a;`';
    var expected = '"use strict";\nvar foo = require("bar")["default"];\n\nvar a;\n\na = 1;\n\nexports["default"] = a;;';

    plugin.compile(content, 'file.coffee', function(error, data) {
      console.log(data);
      expect(error).not.to.be.ok;
      expect(data.data).to.equal(expected);
      done();
    });
  });
});
