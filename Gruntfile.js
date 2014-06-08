module.exports = function(grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= props.license %> */\n',
        // Task configuration
        concat: {
            options: {
                stripBanners: true
            },
            dist: {
                src: ['js/vendor/**.js', 'js/**.js'],
                dest: 'dist/app.js'
            }
        },
        uglify: {
            options: {},
            dist: {
                src: 'dist/require.js',
                dest: 'dist/require.min.js'
            }
        },
        jshint: {
            options: {
                node: true,
                curly: true,
                eqeqeq: false,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: false,
                unused: false,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true
                },
                boss: true
            },
            gruntfile: {
                src: 'gruntfile.js'
            },
            lib_test: {
                src: ['js/**.js']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'qunit']
            }
        },
        // !! This is the name of the task ('requirejs')
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    name: 'main',
                    out: 'dist/require.js',
                    baseUrl: './js',
                    optimize: 'none',
                    mainConfigFile: 'js/main.js',
                    /*paths: {
                        'templates': '../../.tmp/scripts/templates',
                        'jquery': '../../<%= yeoman.app %>/bower_components/jquery/dist/jquery',
                        'underscore': '../../<%= yeoman.app %>/bower_components/underscore/underscore',
                        'backbone': '../../<%= yeoman.app %>/bower_components/backbone/backbone'
                    },*/
                    // https://github.com/yeoman/grunt-usemin/issues/30
                    //generateSourceMaps: true,
                    // required to support SourceMaps
                    // http://requirejs.org/docs/errors.html#sourcemapcomments
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: true
                    //uglify2: {} // https://github.com/mishoo/UglifyJS2
                }
            }
        },


    });





    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');


    // Default task
    grunt.registerTask('default', ['jshint','requirejs','uglify']);
};