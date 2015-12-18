'use strict';

module.exports = {
    _: {
        alias: {}
    },

    // specific annotations (main fields)
    borderRadius: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
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
    component: {
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
    fontStyle: {
        parse: function (line) {
            return line;
        },
        multiple: true
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
    example: {
        parse: function (line) {
            return line;
        },
        multiple: false
    },
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