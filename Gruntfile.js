'use strict';

var grunt = require('grunt');

grunt.initConfig({

    assemble: {
        options: {
            flatten: true,
            assets: './theme/default/assets/',
            helpers: [
                './theme/default/templates/helpers/*.js',
                'handlebars-helpers'
            ],
            partials: [
                './theme/default/templates/partials/**/*.hbs',
                './inventory/templates/partials/**/*.hbs'
            ],
            layout: 'default.hbs',
            layoutdir: './theme/default/templates/layouts',
            data: [
                './theme/default/templates/data/*.{json,yml}',
                './inventory/templates/data/*.{json,yml}'
            ]
        },

        inventory: {
            files: [{
                expand: true,
                cwd: './theme/default/templates/pages/',
                src: '**/*.hbs',
                dest: './dist',
                flatten: true
            }, {
                expand: true,
                cwd: './inventory/templates/pages/',
                src: '**/*.hbs',
                dest: './dist',
                flatten: true
            }]
        }
    },

    copy: {
        theme: {
            files: [{
                expand: true,
                dot: false,
                cwd: './theme/default/',
                dest: './dist/',
                src: [
                    'css/**',
                    'fonts/**',
                    'img/**',
                    'js/**'
                ]
            }]
        },

        assets: {
            options: {},

            files: [{
                expand: true,
                cwd: './inventory/dist/',
                dest: './dist/assets/',
                src: [
                    '**/*',
                    '!*.html'
                ]
            }]
        }
    }
});

grunt.loadNpmTasks('assemble');
grunt.loadNpmTasks('grunt-contrib-copy');

grunt.registerTask('templates', ['assemble:inventory']);

grunt.registerTask('assets', [
    'copy:theme',
    'copy:assets'
]);