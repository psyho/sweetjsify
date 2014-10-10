module.exports = function(grunt) {
  grunt.initConfig({
    browserify: {
      dist: {
        files: {
          'build/build.js': ['src/hello.js'],
        },
        options: {
          transform: [],
        }
      }
    },

    clean: {
      build: 'build/',
    },
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('run', function() {
    require('./build/build.js');
  });

  grunt.registerTask('test', ['clean', 'browserify', 'run']);

  grunt.registerTask('default', ['test']);
};
