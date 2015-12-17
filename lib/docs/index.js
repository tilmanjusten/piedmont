'use strict';

var glob = require('glob'),
    fs = require('fs-extra'),
    path = require('path'),
    _ = require('lodash'),
    markdown = require('./markdown'),
    Doc,
    NavigationPage;

module.exports = function (srcPattern, dest, docTemplateSrc) {
    var files = glob.sync(srcPattern),
        templateCode,
        pages = [];

    if (files.length < 1) {
        return;
    }

    templateCode = fs.readFileSync(docTemplateSrc, 'utf8');

    files.forEach(function (file) {
        var content = fs.readFileSync(path.resolve(file), 'utf8'),
            doc = createDoc(content, templateCode),
            fileData = path.parse(file),
            fileDest = path.resolve(dest, 'doc-' + fileData.name + '.hbs');

        doc.convertContent(markdown.convert);
        doc.searchContentForPosterValues(markdown.poster);

        fs.writeFileSync(fileDest, doc.make(), 'utf8');

        pages.push(new NavigationPage(fileData.name, doc.getTitle(), path.parse(fileDest).name, doc.getParent()));
    });

    return organizeHierarchy(pages);
};

function organizeHierarchy(pages) {
    var result = {},
        rootLevel = pages.filter(function (page) {
            return page.parent === null;
        }),
        subLevel = pages.filter(function (page) {
            return page.parent !== null;
        });

    // Build root level
    rootLevel.forEach(function (page) {
        result[page.id] = page;
    });

    // Build second level
    subLevel.forEach(function (page) {
        if (result[page.parent].subpages === undefined) {
            result[page.parent].subpages = [];
        }

        result[page.parent].subpages.push(page);
    });

    return result;
}

function createDoc(content, templateCode) {
    var doc = new Doc(content);

    doc.setTemplate(templateCode);
    doc.parseContent();
    doc.substituteTemplate();

    return doc;
}

NavigationPage = function (id, name, filename, parent) {
    this.id = id;
    this.name = name;
    this.filename = filename;
    this.parent = parent;
};

Doc = function (content) {
    this.rawContent = content;
    this.poster = '---\nlayout: default\npage-title:Documentation\n---\n';
    this.content = this.rawContent;
    this.templateCode = '';
    this.posterData = {};
    this.posterDataFromContent = {};
    this.build = this.rawContent;
};

Doc.prototype.parseContent = function () {
    var parts;

    if (this.rawContent.search(/^---/i) > -1) {
        parts = this.rawContent.match(/^(---\s??(?:.|\n)+?---\s??)((?:.|\n)+)/i);

        this.poster = parts[1];
        this.content = parts[2];
    }
};

Doc.prototype.preparePosterData = function () {
    var posterDefaults = {
        title: 'Documentation',
        class: 'vsg-page vsg-page--docs',
        layout: 'default',
        parent: null
    };

    this.posterData = _.assign(posterDefaults, this.posterDataFromContent, this.getPosterValuesFromPoster())
};

Doc.prototype.searchContentForPosterValues = function (callback) {
    this.posterDataFromContent = callback(this.rawContent);
};

Doc.prototype.getPosterValuesFromPoster = function () {
    var posterValues = {},
        pattern = /(\w+?)\:(?:\s+?)??([^\n]+)/gi;

    this.poster.match(pattern).map(function (item) {
        var parts = item.split(':').map(_.trim);
        posterValues[parts[0]] = parts[1];
    });

    return posterValues;
};

Doc.prototype.setTemplate = function (template) {
    this.templateCode = template;
};

Doc.prototype.substituteTemplate = function () {
    var template = this.templateCode,
        property;

    // Poster
    for (property in this.posterData) {
        if (this.posterData.hasOwnProperty(property)) {
            template = template.replace('{% ' + property + ' %}', this.posterData[property]);
        }
    }

    // Content
    this.build = template.replace('{% content %}', this.content);
};

Doc.prototype.getTitle = function () {
    return this.posterData.title;
};

Doc.prototype.make = function () {
    this.preparePosterData();
    this.substituteTemplate();

    return this.build;
};

Doc.prototype.getParent = function () {
    return this.posterData.parent;
};

Doc.prototype.convertContent = function (converter) {
    this.content = converter(this.content);
};