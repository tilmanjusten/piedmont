'use strict';

var PartialExtract = require('partial-extract'),
    ComponentInventory = require('component-inventory'),
    StylesheetParser = require('./lib/stylesheet_parser'),
    PrepareStyleguide = require('./lib/prepare_styleguide'),
    exec = require('child_process').exec,
    _ = require('lodash'),
    glob = require('glob'),
    fs = require('fs'),
    path = require('path'),
    util = require('util');

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


// Extract partials
var files = glob.sync('./inventory/dist/*.html');

var pe = new PartialExtract(files, {
    force: true,
    base: './inventory/',
    storage: './inventory/data/extracted-partials.json',
    //partialWrap: false,
    //flatten: true,
    storePartials: false,
    partials: 'partials/'
}); 

// Build component inventory
var ci = new ComponentInventory({
    expand: true,
    destData: './inventory/templates/data/inventory.json',
    destPartials: './inventory/partials/',
    template: './theme/default/templates/interface-inventory.template.hbs',
    storage: './inventory/data/extracted-partials.json',
    dest: {
        path: './inventory/templates/pages/',
        filename: 'interface-inventory',
        ext: '.hbs',
        productionExt: '.html'
    },
    storePartials: false,
    partialExt: '.html'
});

// Make Styleguide
var parser = new StylesheetParser(),
    preparator = new PrepareStyleguide(),
    styleguide = parser.parse('./inventory/src/sass/**/*.scss');

// maybe we don't need to store the extracted styleguide data on the file system
//parser.write('./inventory/data/styleguide.json');

// Create styleguide as json that will be used when the templates will be built with assemble
preparator.create(styleguide, './inventory/templates/data/index.json');


// Build templates
exec('grunt templates');

// Assets
exec('grunt assets');



module.exports = {};