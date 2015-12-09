'use strict';

var StylesheetParser = require('./lib/stylesheet_parser'),
    PrepareStyleguide = require('./lib/prepare_styleguide'),
    exec = require('child_process').exec,
    _ = require('lodash'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    util = require('util');

var config = {
    theme: './theme/default/',
    tmp: './inventory/',
    src: './source/',
    dest: './dist/',
    styles: './inventory/src/sass/**/*.scss'
};

// Process
// - extract partials
//      - from html files in ./inventory/dist/*.html
//      - store in ./inventory/data/extracted-partials.json
// - build component inventory
//      - use database in ./inventory/data/extracted-partials.json
//      - store data in ./inventory/templates/data/inventory.json
//      - store section templates in ./inventory/templates/pages/
//      - store partials in ./inventory/partials/
// - make styleguide
//      - parse scss files in ./inventory/src/sass
// - build templates
//      - use assemble to build templates from theme/default/templates/ and inventory/templates/
//      - use data from theme/default/templates/data and inventory/templates/data
// - assets
//      - copy theme assets (css/, js/, fonts/, img/, assets/ for now) to ./dist/. Maybe we need to add a manifest file
//      - copy assets of the frontend prototype to ./dist/assets/


// Extract partials and build component inventory
exec('grunt inventory');

// Make Styleguide
var parser = new StylesheetParser(),
    preparator = new PrepareStyleguide(),
    styleguide = parser.parse(config.styles);

// maybe we don't need to store the extracted styleguide data on the file system
//parser.write('./inventory/data/styleguide.json');

// Create styleguide as json that will be used when the templates will be built with assemble
preparator.create(styleguide, config.tmp + 'templates/data/index.json');

// Build templates
exec('grunt templates');

// Assets
exec('grunt assets');

module.exports = {};