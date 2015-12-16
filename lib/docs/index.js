'use strict';

var glob = require('glob'),
    fs = require('fs-extra'),
    path = require('path'),
    markdown = require('./markdown');

module.exports = function (srcPattern, dest, docTemplateSrc) {
    var files = glob.sync(srcPattern),
        templateCode;

    if (files.length < 1) {
        return;
    }

    templateCode = fs.readFileSync(docTemplateSrc, 'utf8');

    files.forEach(function (file) {
        var content = fs.readFileSync(path.resolve(file), 'utf8'),
            md = markdown(content, templateCode),
            fileData = path.parse(file),
            fileDest = path.resolve(dest, 'doc-' + fileData.name + '.hbs');

        fs.writeFileSync(fileDest, md, 'utf8');
    });
};