'use strict';

var glob = require('glob'),
    fs = require('fs-extra'),
    path = require('path'),
    markdown = require('./markdown');

module.exports = function (srcPattern, dest, docTemplateSrc) {
    var files = glob.sync(srcPattern),
        template;

    if (files.length < 1) {
        return;
    }

    template = fs.readFileSync(docTemplateSrc, 'utf8');

    files.forEach(function (file) {
        var content = fs.readFileSync(path.resolve(file), 'utf8'),
            md = markdown(content),
            fileData = path.parse(file),
            fileDest = path.resolve(dest, 'doc-' + fileData.name + '.hbs'),
            pageTemplate = template.replace('{% content %}', md);

        fs.writeFileSync(fileDest, pageTemplate, 'utf8');
    });
};