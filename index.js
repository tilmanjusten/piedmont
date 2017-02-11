'use strict';

var stylesheetParser = require('./lib/stylesheet-parser'),
    prepareStyleguide = require('./lib/prepare-styleguide'),
    prepareDocs = require('./lib/docs'),
    componentInventory = require('component-inventory'),
    partialExtract = require('partial-extract'),
    _ = require('lodash'),
    fs = require('fs-extra'),
    path = require('path'),
    assemble = require('assemble'),
    extname = require('gulp-extname'),
    glob = require('glob'),
    Piedmont;

function pm(options, callback) {
    options = typeof options === 'object' ? options : {};
    callback = typeof callback === 'function' ? callback : noop;

    var piedmont = new Piedmont(options);

    piedmont.create(callback);
}

function noop() {

}

Piedmont = function (options) {
    this.options = _.assign({}, this.defaultOptions, options);

    this.options.dest = path.resolve(this.options.cwd, this.options.dest);
    this.options.src = path.resolve(this.options.cwd, this.options.src);
    this.options.styles = typeof this.options.styles === 'string' ?
        path.resolve(this.options.cwd, this.options.styles) :
        false;
    this.options.docs = typeof this.options.docs === 'string' ?
        path.resolve(this.options.cwd, this.options.docs) :
        false;
    this.options.theme = typeof this.options.theme === 'string' ?
        path.resolve(this.options.cwd, this.options.theme) :
        this.defaultOptions.theme;
    this.options.tmp = typeof this.options.tmp === 'string' ?
        path.resolve(this.options.cwd, this.options.tmp) :
        path.resolve(this.options.cwd, this.defaultOptions.tmp);

    // Empty temp and dest folder and ensure they exist
    fs.emptyDirSync(this.options.tmp);
    fs.emptyDirSync(this.options.dest);
    fs.ensureDirSync(this.options.tmp + '/templates/data');
    fs.ensureDirSync(this.options.tmp + '/templates/pages');
};

Piedmont.prototype.defaultOptions = {
    theme: path.resolve(__dirname, 'theme/default'),
    tmp: '.tmp',

    cwd: __dirname,
    dest: 'dist/styling-guidelines',
    src: 'test/fixtures/build',
    styles: 'test/fixtures/styles',
    docs: 'test/fixtures/docs',

    inventory: true
};

Piedmont.prototype.inventory = function () {
    if (!this.options.inventory) {
        return;
    }

    var options = this.options;

    // Extract partials and build component inventory
    partialExtract(glob.sync(options.src + '/*.html'), {
        force: true,
        storage: false,
        //partialWrap: false,
        //flatten: true,
        storePartials: false,
        partials: 'partials/'
    }, function (err, inventory) {
        var ci = componentInventory({
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
    if (!this.options.styles) {
        return;
    }

    var dest = this.options.tmp + '/templates/data/styleguide.json';

    // Make Styleguide
    stylesheetParser(this.options.styles + '/**/*.{less,scss,stylus,sass}', function (err, styleguide) {
        // Create styleguide as json that will be used by assemble for building the templates
        prepareStyleguide(styleguide, dest);
    });
};

Piedmont.prototype.templates = function (callback) {
    const options = this.options;

    let app = assemble({});

    // Build templates
    app.task('templates', function () {
        app.create('pages');
        app.partials(options.theme + '/templates/partials/**/*.hbs');
        app.layouts(options.theme + '/templates/layouts/*.hbs');
        app.data([options.tmp + '/templates/data/*.json', options.theme + '/templates/data/*.json']);
        app.pages([options.tmp + '/templates/pages/*.hbs', options.theme + '/templates/pages/*.hbs']);
        app.toStream('pages')
            .on('err', console.log)
            .pipe(app.renderFile())
            .on('assemble', console.log)
            .pipe(extname())
            .pipe(app.dest(function (file) {
                // set dirname to destination path
                file.dirname = options.dest;
                return file.base;
            }))
            .on('end', function () {
                console.log('Templates done!');
                callback();
            });
    });

    app.build(['templates'], err => { if (err) throw err });
};

Piedmont.prototype.assets = function () {
    if (!this.options.styles && !this.options.inventory) {
        return;
    }

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

Piedmont.prototype.docs = function () {
    if (!this.options.docs) {
        return;
    }

    var dest = this.options.tmp + '/templates/pages',
        srcPattern = this.options.docs + '/*.md',
        docTemplateSrc = this.options.theme + '/templates/doc.template.hbs',
        pages;

    // build page templates from markdown documents
    pages = prepareDocs(srcPattern, dest, docTemplateSrc);

    if (pages) {
        fs.writeJsonSync(this.options.tmp + '/templates/data/docs.json', {items: pages});
    }
};

Piedmont.prototype.create = function (callback) {
    callback = typeof callback === 'function' ? callback : noop;

    this.assets();
    this.styleguide();
    this.inventory();
    this.docs();
    this.templates(callback);
};


module.exports = pm;
module.exports.Piedmont = Piedmont;
