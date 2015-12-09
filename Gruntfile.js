'use strict';

var grunt = require('grunt');

var config = grunt.readJSON(grunt.option('configFile'));

grunt.initConfig({

    assemble: {
        options: {
            flatten: true,
            assets: config.theme + 'assets/',
            helpers: [
                config.theme + 'templates/helpers/*.js',
                'handlebars-helpers'
            ],
            partials: [
                config.theme + 'templates/partials/**/*.hbs',
                config.tmp + 'templates/partials/**/*.hbs'
            ],
            layout: 'default.hbs',
            layoutdir: config.theme + 'templates/layouts',
            data: [
                config.theme + 'templates/data/*.{json,yml}',
                config.tmp + 'templates/data/*.{json,yml}'
            ]
        },

        inventory: {
            files: [{
                expand: true,
                cwd: config.theme + 'templates/pages/',
                src: '**/*.hbs',
                dest: './dist',
                flatten: true
            }, {
                expand: true,
                cwd: config.tmp + 'templates/pages/',
                src: '**/*.hbs',
                dest: './dist',
                flatten: true
            }]
        }
    },

    'component-inventory': {
        inventory: {
            options: {
                expand: true,
                destData: config.tmp + 'templates/data/inventory.json',
                destPartials: config.tmp + 'partials/',
                template: config.theme + 'templates/interface-inventory.template.hbs',
                storage: config.tmp + 'data/extracted-partials.json',
                dest: {
                    path: config.tmp + 'templates/pages/',
                    filename: 'interface-inventory',
                    ext: '.hbs',
                    productionExt: '.html'
                },
                storePartials: false,
                partialExt: '.html'
            }
        }
    },

    copy: {
        theme: {
            files: [{
                expand: true,
                dot: false,
                cwd: config.theme,
                dest: config.dest,
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
                cwd: config.src,
                dest: config.dest + 'assets/',
                src: [
                    '**/*',
                    '!*.html'
                ]
            }]
        }
    },

    'partial-extract': {
        inventory: {
            options: {
                force: true,
                base: config.tmp,
                storage: config.tmp + 'data/extracted-partials.json',
                //partialWrap: false,
                //flatten: true,
                storePartials: false,
                partials: 'partials/'
            },
            files: [{
                expand: true,
                cwd: config.src,
                src: '*.html'
            }]
        }
    }
});

grunt.loadNpmTasks('assemble');
grunt.loadNpmTasks('grunt-component-inventory');
grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-partial-extract');

grunt.registerTask('inventory', [
    'partial-extract:inventory',
    'component-inventory:inventory'
]);

grunt.registerTask('templates', ['assemble:inventory']);

grunt.registerTask('assets', [
    'copy:theme',
    'copy:assets'
]);
