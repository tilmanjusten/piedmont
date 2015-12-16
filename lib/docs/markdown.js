'use strict';

var marked = require('marked'),
    _ = require('lodash'),
    Doc;

module.exports = function (content, templateCode) {
    var doc = new Doc(content);

    doc.setTemplate(templateCode);
    doc.parseContent();
    doc.preparePoster();
    doc.convertToMarkdown();
    doc.substituteTemplate();

    return doc;
};

Doc = function (content) {
    this.rawContent = content;
    this.poster = '---\nlayout: default\npage-title:Documentation\n---\n';
    this.content = this.rawContent;
    this.templateCode = '';
    this.template = '';
    this.posterData = {};
};

Doc.prototype.convertToMarkdown = function () {
    marked.setOptions({});

    this.content = marked(this.content);
};

Doc.prototype.parseContent = function () {
    var parts;

    if (this.rawContent.search(/^---/i) > -1) {
        parts = this.rawContent.match(/^(---\s??(?:.|\n)+?---\s??)((?:.|\n)+)/i);

        this.poster = parts[1];
        this.content = parts[2];
    }
};

Doc.prototype.preparePoster = function () {
    var posterDefaults = {
        title: 'Documentation',
        class: 'vsg-page vsg-page--docs',
        layout: 'default',
        parent: null
    };


    this.posterData = _.assign(posterDefaults, this.getPosterValuesFromContent(), this.getPosterValuesFromPoster())
};

Doc.prototype.getPosterValuesFromContent = function () {
    var posterValues = {},
        titlePattern = /#\s?([^\n]+)/i;

    // first headline is document title: `# First Headline`
    if (this.rawContent.search(titlePattern) > -1) {
        posterValues.title = this.rawContent.match(titlePattern)[1];
    }

    return posterValues;
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
    this.content = template.replace('{% content %}', this.content);
};

Doc.prototype.getTitle = function () {
    return this.posterData.title;
};

Doc.prototype.getContent = function () {
    return this.content;
};

Doc.prototype.getParent = function () {
    return this.posterData.parent;
};