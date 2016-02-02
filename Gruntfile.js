// Generated on 2013-11-29 using generator-angular 0.6.0-rc.2
'use strict';

var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist',
      build_version: 1
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      less: {
        files: ['<%= yeoman.app %>/less/**/{,*/}*.less'],
        tasks: ['less:compile', 'livereload']
      },
      livereload: {
          files: [
              '<%= yeoman.app %>/{,*/}*.html',
              '<%= yeoman.app %>/views/**/*.html',
			  '<%= yeoman.app %>/templates/{,*/}*.html',
              '<%= yeoman.app %>/scripts/{,*/}*.js',
              '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
          ],
          tasks: ['copy:dist', 'copy:serve', 'livereload']
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 7000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        middleware: function (connect) {
          return [
            lrSnippet,
            mountFolder(connect, 'dist')
          ];
        }
      },
      livereload: {},
      test: {
        options: {
          port: 9123,
          base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    open: {
      server: {
          url: 'http://localhost:<%= connect.options.port %>'
      }
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'test/unit/{,*/}*.js',
        '<%= yeoman.app %>/scripts/{,*/}*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/unit/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      build: ['build', '<%= yeoman.dist %>/config/config.js'],
      server: '.tmp'
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css'
           ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },
    htmlmin: {
      dist: {
        options: {
          // Optional configurations that you can uncomment to use
          removeCommentsFromCDATA: true
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: ['*.html', 'templates/{,*/}*.html', 'views/**/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    less: {
      options: {compress: true, paths: ['<%= yeoman.app %>/less']},
      compile: { files: { '<%= yeoman.dist %>/styles/main.css': '<%= yeoman.app %>/less/app.less' } }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [
            {
                  expand: true,
                  dot: true,
                  cwd: '<%= yeoman.app %>',
                  dest: '<%= yeoman.dist %>',
                  src: [
                    '*.{ico,png,txt}',
                    'vendor/**/*',
					'templates/**/*',
                    'images/**/*',
					'img/**/*',
                    'fonts/**/*',
                    'config/*'
                  ]
            }
        ]
      },
      images: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      },
        serve: {
            files:[
                {expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'scripts/**/*',
                        'index.html',
						'templates/**/*',
                        'views/**/*'
                    ]
                }
            ]
        }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'less:compile'
      ],
      test: [
//        'less:compile'
      ],
      dist: [
        'less:compile',
        'copy:images',
        'htmlmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    cssmin: {
       dist: {
         files: {
           '<%= yeoman.dist %>/styles/main.css': [
             '<%= yeoman.app %>/styles/{,*/}*.css'
           ]
         }
       }
    },
    uglify: {
       dist: {
         files: {
           '<%= yeoman.dist %>/scripts/scripts.js': [
             '<%= yeoman.dist %>/scripts/scripts.js'
           ]
         }
       }
    },
    concat: {
       dist: {}
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    shell: {
        package: {
            command: 'mkdir build && fpm -s dir -n civix-web -a all -d sudo -t deb --after-install "deployment/after-install" -v <%= yeoman.build_version %> -p build/civix-web.deb dist/=/srv/civix-web/',
            options: {
                stdout: true,
                stderr: true
            }
        }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
        'clean:dist',
        'clean:server',
        'copy:dist',
        'copy:serve',
        'less:compile',
        'connect:livereload',
        'livereload-start',
        'dev-info',
        'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('dev-info', function () {
      grunt.log.warn('DO NOT FORGET ABOUT CONFIG FILE');
  });

  grunt.registerTask('test', [
    'clean:server',
    'jshint:all',
    'concurrent:test',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', function (version) {
      grunt.log.write('Build with version: ' + version);
      var yeoman = grunt.config('yeoman');
      yeoman.build_version = version;
      grunt.config('yeoman', yeoman);
      grunt.task.run([
          'clean:dist',
          'jshint:all',
          'useminPrepare',
          'less:compile',
          'copy:images',
          'htmlmin',
          'concat',
          'ngmin',
          'copy:dist',
          'less:compile',
          'cdnify',
          'cssmin',
          'uglify',
          'rev',
          'usemin',
          'clean:build',
          'shell:package:' + version
      ]);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
