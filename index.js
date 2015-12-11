'use strict';

var StylesheetParser = require('./lib/stylesheet_parser'),
    PrepareStyleguide = require('./lib/prepare_styleguide'),
    ComponentInventory = require('component-inventory'),
    PartialExtract = require('partial-extract'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path'),
    assemble = require('assemble'),
    extname = require('gulp-extname'),
    vfs = require('vinyl-fs'),
    glob = require('glob');

var options = {
    theme: path.resolve(__dirname, 'theme/default'),
    tmp: path.resolve(__dirname, '.tmp'),

    cwd: __dirname,
    dest: 'test/result/styling-guidelines',
    src: 'test/fixtures/build',
    styles: 'test/fixtures/styles'
};

module.exports = function (_options) {
    var config = _.assign(options, _options);
    
    config.dest = path.resolve(config.cwd, config.dest);
    config.src = path.resolve(config.cwd, config.src);
    config.styles = path.resolve(config.cwd, config.styles);

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

    // Empty temp and dest folder
    fs.emptyDirSync(config.tmp);
    fs.emptyDirSync(config.dest);

    // Extract partials and build component inventory
    var extract = new PartialExtract(glob.sync(config.src + '/*.html'), {
        force: true,
        base: config.dest,
        storage: config.tmp + '/interface-inventory.json',
        //partialWrap: false,
        //flatten: true,
        storePartials: false,
        partials: 'partials/'
    });

    var components = new ComponentInventory({
        expand: true,
        storage: config.tmp + '/interface-inventory.json',
        destData: config.tmp + '/templates/data/inventory-sections.json',
        dest: {
            path: config.tmp + '/templates/pages',
            filename: 'component-inventory',
            ext: '.hbs',
            productionExt: '.html'
        }
    });

    // Make Styleguide
    var parser = new StylesheetParser(),
        preparator = new PrepareStyleguide(),
        styleguide = parser.parse(config.styles + '/**/*.scss');

    // maybe we don't need to store the extracted styleguide data on the file system
    //parser.write('./build/data/styleguide.json');

    // Create styleguide as json that will be used when the templates will be built with assemble
    fs.ensureDirSync(config.tmp + '/templates/data');
    preparator.create(styleguide, config.tmp + '/templates/data/styleguide.json');

    // Build templates
    //exec('grunt template --configFile=' + config.configFile);

    // Theme assets
    vfs.src('**/*.css', {cwd: config.theme + '/css'}).pipe(vfs.dest(config.dest + '/css' ));
    vfs.src('**/*',     {cwd: config.theme + '/fonts'}).pipe(vfs.dest(config.dest + '/fonts'));
    vfs.src('**/*',     {cwd: config.theme + '/img'}).pipe(vfs.dest(config.dest + '/img'));
    vfs.src('**/*.js',  {cwd: config.theme + '/js'}).pipe(vfs.dest(config.dest + '/js'));

    // Inventory assets
    vfs.src(['**/*', '!*.html'], {cwd: config.src}).pipe(vfs.dest(config.dest + '/assets'));
};
