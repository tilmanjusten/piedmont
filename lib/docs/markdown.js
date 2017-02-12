'use strict';

var marked = require('marked');
var highlightJs = require('highlight.js');

module.exports.convert = function (content) {
    marked.setOptions({
        highlight: function (code) {
            return highlightJs.highlightAuto(code).value;
        }
    });

    return marked(content);
};

module.exports.poster = function (content) {
    var posterValues = {};
    var titlePattern = /#\s?([^\n]+)/i;

    // first headline is document title: `# First Headline`
    if (content.search(titlePattern) > -1) {
        posterValues.title = content.match(titlePattern)[1];
    }

    return posterValues;
};