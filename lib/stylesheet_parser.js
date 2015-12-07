'use strict';

var ScssCommentParser = require('scss-comment-parser');
var fs = require('fs');
var glob = require('glob');

var annotations = {
    _: {
        alias: {}
    },

    // specific annotations (main fields)
    boxShadow: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    color: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    font: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    fontFamily: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    fontSize: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    fontWeight: {
        parse: function (line) {
            return line;
        },
        multiple: true
    },
    gradient: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    lineHeight: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    spacing: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    timing: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    transition: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },

    // generic annotations (additional fields)
    group: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    type: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
    value: {
        parse: function (line) {
            return line;
        },
        multiple: false
    }
};

var parser = new ScssCommentParser(annotations, {}, {
    lineComment: true,
    blockComment: true,
    lineCommentStyle: '//',
    blockCommentStyle: '/**'
});

var StylesheetParser = function () {

};

StylesheetParser.prototype.parse = function (pattern) {
    var comments = {};
    this.files = glob.sync(pattern);

    this.files.forEach(function (absPath) {
        var fileContent = fs.readFileSync(absPath, 'utf8');

        comments[absPath] = parser.parse(fileContent);
    });

    console.log('Parsed ' + this.files.length + ' source files.');

    this.comments = comments;

    return this.comments;
};

StylesheetParser.prototype.write = function (dest) {
    fs.writeFileSync(dest, JSON.stringify(this.comments, null, '\t'));

    console.log('Comments data written to ' + dest);
};

module.exports = StylesheetParser;
