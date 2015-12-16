'use strict';

var glob = require('glob'),
    fs = require('fs-extra'),
    path = require('path'),
    markdown = require('./markdown'),
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
            doc = markdown(content, templateCode),
            fileData = path.parse(file),
            fileDest = path.resolve(dest, 'doc-' + fileData.name + '.hbs');

        fs.writeFileSync(fileDest, doc.getContent(), 'utf8');

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

NavigationPage = function (id, name, filename, parent) {
    this.id = id;
    this.name = name;
    this.filename = filename;
    this.parent = parent;
};