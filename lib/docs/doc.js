'use strict';

var _ = require('lodash');

var Doc = function (content) {
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

    this.posterData = _.assign({}, posterDefaults, this.posterDataFromContent, this.getPosterValuesFromPoster())
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


module.exports = Doc;