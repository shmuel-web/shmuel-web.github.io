module.exports = function(grunt) {

  var mozjpeg = require('imagemin-mozjpeg');

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    imagemin: {                          // Task 
      
      dynamic: {                         // Another target 
        options: {                       // Target options 
          optimizationLevel: 7,
          svgoPlugins: [{ removeViewBox: false }],
          use: [mozjpeg()]
        },
        files: [{
          expand: true,                  // Enable dynamic expansion 
          cwd: 'images/',                   // Src matches are relative to this path 
          src: ['*.{png,jpg,gif,svg}','*/*.{png,jpg,gif,svg}','*/*/*.{png,jpg,gif,svg}'],   // Actual patterns to match 
          dest: 'img.min/'                  // Destination path prefix 
        }]
      }
    },

    concat: {
    options: {
      separator: ';',
    },
    dist: {
      src: ['js/jquery.min.js','js/plugins.js','js/owl.js','js/script.js','js/my.js'],
      dest: 'js/global.js',
    },
  },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'css',
          src: ['main.css'],
          dest: 'css',
          ext: '.min.css'
        }]
      }
    },

    uglify: {
      options: {
        sourceMap: true,
        mangle: false
      },
      build: {
        files: {
          'js/global.min.js': ['js/plugins.js','js/owl.js','js/script.js','js/my.js'],
        }
      }
    },

    sass: {                              // Task 
      dist: {                            // Target 
        options: {                       // Target options 
          style: 'expanded'
        },
        files: {                         // Dictionary of files 
          'css/main.css': 'css/main.scss'       // 'destination': 'source' 
        }
      }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // Default task(s).
  grunt.registerTask('default', ['uglify','sass','cssmin']);
  

};