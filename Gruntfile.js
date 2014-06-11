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
        uglify: {
            options: {
                preserveComments: false,
                banner: '/*! GazzaScroll v.01 @flolovebit @mattimatti */'
            },
            dist: {
                src: 'js/require.production.js',
                dest: 'js/require.min.js'
            }
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['src/productionfix.js', 'js/require.js'],
                dest: 'js/require.production.js',
            },
        },
        jshint: {
            options: {
                node: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: false,
                eqnull: true,
                browser: true,
                globals: {
                    jQuery: true,
                    define: true,
                    createjs: true,
                    $: true,
                    s: true,
                    TweenMax: true,
                    videojs: true
                },
                boss: true
            },
            gruntfile: {
                src: 'gruntfile.js'
            },
            lib_test: {
                src: ['src/**.js']
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
        requirejs: {
            dist: {
                options: {
                    name: "almond",
                    out: 'js/require.js',
                    baseUrl: './src',
                    include: ["main"],
                    optimize: 'none',
                    mainConfigFile: 'src/main.js',
                    preserveLicenseComments: false,
                    useStrict: false,
                    wrap: true
                }
            }
        },

        docco: {
            debug: {
                src: ['src/**/*.js'],
                options: {
                    output: 'docs/'
                }
            }
        }


    });



    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-docco');


    // Default task
    grunt.registerTask('default', ['jshint']);
    grunt.registerTask('debug', ['jshint', 'requirejs','uglify']);
    grunt.registerTask('release', ['jshint', 'requirejs', 'concat:dist', 'uglify']);
};