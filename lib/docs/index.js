'use strict';

var glob = require('glob');
var fs = require('fs-extra');
var path = require('path');
var markdown = require('./markdown');
var Doc = require('./doc');
var NavigationPage = require('./navigation-page');

module.exports = function (srcPattern, dest, docTemplateSrc) {
    var files = glob.sync(srcPattern);
    var pages = [];

    if (files.length < 1) {
        return;
    }

    var templateCode = fs.readFileSync(docTemplateSrc, 'utf8');

    files.forEach(function (file) {
        var content = fs.readFileSync(path.resolve(file), 'utf8');
        var doc = createDoc(content, templateCode);
        var fileData = path.parse(file);
        var fileDest = path.resolve(dest, 'doc-' + fileData.name + '.hbs');

        doc.convertContent(markdown.convert);
        doc.searchContentForPosterValues(markdown.poster);

        fs.writeFileSync(fileDest, doc.make(), 'utf8');

        pages.push(new NavigationPage(fileData.name, doc.getTitle(), path.parse(fileDest).name, doc.getParent()));
    });

    return organizeHierarchy(pages);
};

function organizeHierarchy(pages) {
    var result = {};
    var rootLevel = pages.filter(function (page) {
        return page.parent === null;
    });
    var subLevel = pages.filter(function (page) {
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

    return doc;
}