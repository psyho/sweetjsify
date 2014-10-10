var transformTools = require('browserify-transform-tools');
var sourceMap = require('convert-source-map');
var _ = require('underscore');

var defaults = {
  sourceMap: true,
  readableNames: true,
  modules: [],
};

var useMacros = /"use macros"|'use macros'/;

function fileUsesMacros(content) {
  return useMacros.test(content);
}

function loadModules(modules, done) {
  var sweet = require('sweet.js');

  try {
    modules.forEach(function(mod) {
      sweet.loadMacro(mod);
    });
  } catch(e) {
    done('Error while loading modules:\n' + e);
    return;
  }

  return sweet;
}

function compile(sweet, config, done) {
  var opts = _.omit(config, 'modules');
  try {
    return sweet.compile(config.content, opts);
  } catch(e) {
    done('Error in file: ' + config.filename + '\n' + e);
  }
}

function addSourceMap(result, config, done) {
  if(config.sourceMap) {
    var map = sourceMap.fromJSON(result.sourceMap);
    map.sourcemap.sourcesContent = [config.content];
    done(null, result.code + '\n' + map.toComment());
  } else {
    done(null, result.code);
  }
}

function sweetjsify(content, transformOptions, done) {
  var opts = _.extend({filename: transformOptions.file, content: content},
                    defaults,
                    transformOptions.config);

  if(!fileUsesMacros(content)) {
    return done(null, content);
  }

  var sweet = loadModules(opts.modules, done);
  if(!sweet) { return; }

  var result = compile(sweet, opts, done);
  if(!result) { return; }

  addSourceMap(result, opts, done);
}

var options = { includeExtensions: [".js", ".sjs"] };
module.exports = transformTools.makeStringTransform("sweetjsify", options, sweetjsify);
