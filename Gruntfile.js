'use strict';

var grunt = require('grunt');

var config = grunt.file.readJSON(grunt.option('configFile'));

grunt.initConfig({

    assemble: {
        options: {
            flatten: true,
            assets: config.theme + 'assets/',
            helpers: [
                config.theme + '/templates/helpers/*.js',
                'handlebars-helpers'
            ],
            partials: [
                config.theme + '/templates/partials/**/*.hbs',
                config.base + '/templates/partials/**/*.hbs'
            ],
            layout: 'default.hbs',
            layoutdir: config.theme + '/templates/layouts',
            data: [
                config.theme + '/templates/data/*.{json,yml}',
                config.base + '/templates/data/*.{json,yml}'
            ]
        },

        inventory: {
            files: [{
                expand: true,
                cwd: config.theme + '/templates/pages/',
                src: '**/*.hbs',
                dest: config.base + '/dest',
                flatten: true
            }, {
                expand: true,
                cwd: config.base + '/templates/pages/',
                src: '**/*.hbs',
                dest: config.base + '/dest',
                flatten: true
            }]
        }
    }
});

grunt.loadNpmTasks('assemble');

grunt.registerTask('templates', ['assemble:inventory']);

