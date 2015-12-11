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
    },

    'component-inventory': {
        inventory: {
            options: {
                expand: true,
                destData: config.base + '/templates/data/inventory.json',
                destPartials: config.base + '/partials/',
                template: config.theme + '/templates/interface-inventory.template.hbs',
                storage: config.base + '/data/extracted-partials.json',
                dest: {
                    path: config.base + '/templates/pages/',
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
                dest: config.base + '/dest',
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
                dest: '.tmp/dest/assets/',
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
                base: config.base,
                storage: '.tmp/data/extracted-partials.json',
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
