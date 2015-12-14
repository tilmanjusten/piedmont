'use strict';

var stylesheetParser = require('./lib/stylesheet-parser'),
    prepareStyleguide = require('./lib/prepare-styleguide'),
    componentInventory = require('component-inventory'),
    partialExtract = require('partial-extract'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path'),
    assemble = require('assemble'),
    extname = require('gulp-extname'),
    glob = require('glob');

module.exports = pm;

function pm(options, callback) {
    options = typeof options === 'object' ? options : {};
    callback = typeof callback === 'function' ? callback : noop;

    var piedmont = new Piedmont(options);

    piedmont.create(callback);
}

function noop() {

}

var Piedmont = function(options) {
    this.options = _.assign(this.defaultOptions, options);

    this.options.dest = path.resolve(this.options.cwd, this.options.dest);
    this.options.src = path.resolve(this.options.cwd, this.options.src);
    this.options.styles = path.resolve(this.options.cwd, this.options.styles);

    // Empty temp and dest folder
    fs.emptyDirSync(this.options.tmp);
    fs.emptyDirSync(this.options.dest);
    fs.ensureDirSync(this.options.tmp + '/templates/data');
};

Piedmont.prototype.defaultOptions = {
    theme: path.resolve(__dirname, 'theme/default'),
    tmp: path.resolve(__dirname, '.tmp'),

    cwd: __dirname,
    dest: 'test/result/styling-guidelines',
    src: 'test/fixtures/build',
    styles: 'test/fixtures/styles'
};

Piedmont.prototype.inventory = function () {
    var options = this.options,
        ci;

    // Extract partials and build component inventory
    partialExtract(glob.sync(options.src + '/*.html'), {
        force: true,
        base: options.dest,
        storage: false,
        //partialWrap: false,
        //flatten: true,
        storePartials: false,
        partials: 'partials/'
    }, function (err, inventory) {
        ci = componentInventory({
            expand: true,
            storage: inventory,
            destData: options.tmp + '/templates/data/inventory.json',
            dest: {
                path: options.tmp + '/templates/pages',
                filename: 'component-inventory',
                ext: '.hbs',
                productionExt: '.html'
            },
            template: options.theme + '/templates/interface-inventory.template.hbs'
        });

        ci.create();
    });

};

Piedmont.prototype.styleguide = function () {
    var dest = this.options.tmp + '/templates/data/styleguide.json';

    // Make Styleguide
    stylesheetParser(this.options.styles + '/**/*.scss', function (err, styleguide) {
        // Create styleguide as json that will be used by assemble for building the templates
        prepareStyleguide(styleguide, dest);
    });
};

Piedmont.prototype.templates = function () {
    // Build templates
    assemble.partials(this.options.theme + '/templates/partials/**/*.hbs');
    assemble.layouts(this.options.theme + '/templates/layouts/*.hbs');
    assemble.data([this.options.tmp + '/templates/data/*.json', this.options.theme + '/templates/data/*.json']);
    assemble.src([this.options.tmp + '/templates/pages/*.hbs', this.options.theme + '/templates/pages/*.hbs'])
        .pipe(extname())
        .pipe(assemble.dest(this.options.dest));
};

Piedmont.prototype.assets = function () {
    var options = this.options;

    fs.access(this.options.theme + '/css', function (err) {
        if (err) return;
        fs.copySync(options.theme + '/css', options.dest + '/css');
    });

    fs.access(this.options.theme + '/fonts', function (err) {
        if (err) return;
        fs.copySync(options.theme + '/fonts', options.dest + '/fonts');
    });

    fs.access(this.options.theme + '/img', function (err) {
        if (err) return;
        fs.copySync(options.theme + '/img', options.dest + '/img');
    });

    fs.access(this.options.theme + '/js', function (err) {
        if (err) return;
        fs.copySync(options.theme + '/js', options.dest + '/js');
    });

    // Inventory assets
    fs.copySync(this.options.src, this.options.dest + '/assets');
};

Piedmont.prototype.create = function (callback) {
    callback = typeof callback === 'function' ? callback : noop;

    this.assets();
    this.styleguide();
    this.inventory();
    this.templates();

    // Wait for the files in assets() and templates() to be written, seems to be kind of async
    setTimeout(function () {
        callback(null, null);
    }, 2000);
};
