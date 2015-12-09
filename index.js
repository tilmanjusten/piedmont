'use strict';

var StylesheetParser = require('./lib/stylesheet_parser'),
    PrepareStyleguide = require('./lib/prepare_styleguide'),
    exec = require('child_process').exec,
    _ = require('lodash'),
    mkdirp = require('mkdirp'),
    fs = require('fs'),
    path = require('path');

var options = {
    theme: path.resolve(__dirname, 'theme/default/'),
    tmp: '.tmp/inventory',
    src: 'dist',
    dest: 'styling-guidelines',
    styles: './src/sass/**/*.scss',
    configFile: '.tmp/inventory/piedmont.json'
};

module.exports = function (_options) {
    var config = _.assign(options, _options);

    // Write config to file and create destination directory if not exists
    try {
        fs.accessSync(path.dirname(config.configFile), fs.R_OK | fs.W_OK);
    } catch (err) {
        mkdirp.sync(path.dirname(config.configFile));
    }

    fs.writeFileSync(config.configFile, JSON.stringify(config, null, '\t'), 'utf8');

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
    exec('grunt inventory --configFile=' + config.configFile);

    // Make Styleguide
    var parser = new StylesheetParser(),
        preparator = new PrepareStyleguide(),
        styleguide = parser.parse(config.styles);

    // maybe we don't need to store the extracted styleguide data on the file system
    //parser.write('./inventory/data/styleguide.json');

    // Create styleguide as json that will be used when the templates will be built with assemble
    preparator.create(styleguide, path.resolve(config.tmp, 'templates/data/styleguide.json'));

    // Build templates
    exec('grunt template --configFile=' + config.configFile);

    // Assets
    exec('grunt assets --configFile=' + config.configFile);
};
