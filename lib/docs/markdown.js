'use strict';

var marked = require('marked'),
    Doc;

module.exports = function (content) {
    var doc = new Doc(content);

    doc.convertToMarkdown();

    return doc.getMarkdown();
};

Doc = function (content) {
    this.rawContent = content;
    this.markdownContent = '';
};

Doc.prototype.convertToMarkdown = function () {
    marked.setOptions({

    });

    this.markdownContent = marked(this.rawContent);
};

Doc.prototype.getMarkdown = function () {
    return this.markdownContent;
};