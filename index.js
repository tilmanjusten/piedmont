'use strict';

var StylesheetParser = require('./lib/stylesheet_parser'),
    PrepareStyleguide = require('./lib/prepare_styleguide'),
    exec = require('child_process').execSync,
    _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path');

var options = {
    theme: path.resolve(__dirname, 'theme/default'),
    src: 'test/fixtures/build',
    dest: 'test/result/styling-guidelines',
    styles: 'test/fixtures/styles'
};

module.exports = function (_options) {
    var config = _.assign(options, _options);

    config.base = path.resolve(__dirname, '.tmp');
    config.configFile = path.resolve(config.base, 'piedmont.json');

    // Process
    // - copy source files to .tmp folder where the files are available in grunt workflow
    // - extract partials
    //      - from html files in .tmp/build/*.html
    //      - store in .tmp/data/extracted-partials.json
    // - build component inventory
    //      - use database in .tmp/data/extracted-partials.json
    //      - store data in .tmp/data/inventory.json
    //      - store section templates in .tmp/build/templates/pages/
    //      - store partials in .tmp/partials/
    // - make styleguide
    //      - parse scss files in .tmp/styles
    // - build templates
    //      - use assemble to build templates from theme/default/templates/ and .tmp/templates/
    //      - use data from theme/default/templates/data and .tmp/templates/data
    // - assets
    //      - copy theme assets (css/, js/, fonts/, img/, assets/ for now) to .tmp/dest/. Maybe we need to add a manifest file
    //      - copy assets of the frontend prototype to .tmp/dest/assets/

    // Empty temp folder
    fs.emptydirSync(config.base);

    // Write config to file and create destination directory if not exists
    fs.writeJsonSync(config.configFile, config);

    // copy files
    fs.copySync(config.src, path.resolve(config.base, 'inventory'));
    fs.copySync(config.styles, path.resolve(config.base, 'styles'));

    // Extract partials and build component inventory
    exec('grunt inventory --configFile=' + config.configFile);

    // Make Styleguide
    var parser = new StylesheetParser(),
        preparator = new PrepareStyleguide(),
        styleguide = parser.parse(path.resolve(config.base, 'styles') + '/**/*.scss');

    // maybe we don't need to store the extracted styleguide data on the file system
    //parser.write('./build/data/styleguide.json');

    // Create styleguide as json that will be used when the templates will be built with assemble
    preparator.create(styleguide, config.base + '/templates/data/styleguide.json');

    // Build templates
    exec('grunt template --configFile=' + config.configFile);

    // Assets
    exec('grunt assets --configFile=' + config.configFile);
};
