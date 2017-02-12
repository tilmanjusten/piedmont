'use strict';

var ScssCommentParser = require('scss-comment-parser');
var fs = require('fs-extra');
var path = require('path');
var glob = require('glob');
var annotations = require('./annotations');
var parser;


module.exports = p;

function p(pattern, callback) {
    callback = typeof callback === 'function' ? callback : noop;
    var preparator = new StylesheetParser();
    var result = preparator.parse(pattern);

    callback(null, result);
}

function noop() {

}

parser = new ScssCommentParser(annotations, {}/*, {
    lineComment: true,
    blockComment: true,
    lineCommentStyle: '//',
    blockCommentStyle: '/!**'
}*/);

function StylesheetParser() {

}

StylesheetParser.prototype.parse = function (pattern) {
    var comments = {};
    this.files = glob.sync(pattern);

    this.files.forEach(function (absPath) {
        var fileContent = fs.readFileSync(absPath, 'utf8'),
            relativePath = path.relative('./', absPath);

        comments[relativePath] = parser.parse(fileContent);
    });

    this.comments = comments;

    return this.comments;
};

StylesheetParser.prototype.create = function (dest) {
    // Create destination directory if not exists
    try {
        fs.accessSync(path.dirname(dest), fs.R_OK | fs.W_OK);
    } catch (err) {
        fs.ensureDirSync(path.dirname(dest));
    }

    fs.writeFileSync(dest, JSON.stringify(this.comments, null, '\t'));
};
