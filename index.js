var transformTools = require('browserify-transform-tools');
var sourceMap = require('convert-source-map');
var extend = require('underscore').extend;

var defaults = {
  sourceMap: false,
  readableNames: true,
  modules: [],
};

var useMacros = /"use macros"|'use macros'/;

var options = {
  includeExtensions: [".js", ".sjs"]
};

module.exports = transformTools.makeStringTransform(
  "sweetjsify",
  options,
  function (content, transformOptions, done) {
    var filename = transformOptions.file;
    var config = transformOptions.config || {};
    var modules = config.modules || [];
    var sweet = require('sweet.js');

    if(!useMacros.test(content)) {
      return done(null, content);
    }

    try {
      modules.forEach(function(mod) {
        sweet.loadMacro(mod);
      });
    } catch(e) {
      return done('Error while loading modules:' + filename + '\n' + e);
    }

    var opts = extend({filename: filename}, defaults, config);
    var result;
    delete opts.modules;
    try {
      result = sweet.compile(content, opts);
    } catch(e) {
      return done('Error in file: ' + filename + '\n' + e);
    }

    if(config.sourceMap) {
      var map = sourceMap.fromJSON(result.sourceMap);
      map.sourcemap.sourcesContent = [buffer];
      done(null, result.code + '\n' + map.toComment());
    } else {
      done(null, result.code);
    }
  }
);
