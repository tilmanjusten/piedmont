'use strict';

var fs = require('fs-extra'),
    path = require('path');

module.exports = p;

function p(data, dest, callback) {
    data = typeof data === 'object' ? data : {};
    dest = typeof dest === 'string' ? dest : './tmp/styleguide.json';
    callback = typeof callback === 'function' ? callback : noop;

    var preparator = new DataPreparator(),
        result = preparator.create(data, dest);

    callback(null, result);
}

function noop() {

}

var boxShadow = function (data) {
    var value = data.value || data.context.value;
    var variable = '$' + data.context.name;

    return {
        name: data.color,
        variable: variable,
        value: value
    };
};

// store color values to be exchanged by variable name
var colorCache = {};

var color = function (data) {
    var value = data.context.value.match(/^\$/i) ? colorCache[data.context.value] : data.context.value;
    var variable = '$' + data.context.name;
    var group = data.group || 'Base';

    // override value by @value value if exists, e.g. for transparentize($color, 0.1)
    value = data.value || value;

    colorCache[variable] = value;

    return {
        name: data.color,
        variable: variable,
        value: value,
        group: group
    };
};

var gradient = function (data) {
    var value = data.value || data.context.value;
    var variable = '$' + data.context.name;
    var type = data.type || 'undefined';

    return {
        name: data.gradient,
        variable: variable,
        value: value,
        type: type
    };
};

var font = function (data) {
    var variable = '$' + data.context.name;

    return {
        name: data.font,
        variable: variable,
        value: data.context.value,
        weights: data.fontWeight || []
    };
};

var fontSize = function (data) {
    var variable = '$' + data.context.name;

    return {
        name: data.fontSize,
        variable: variable,
        value: data.context.value
    };
};

var lineHeight = function (data) {
    var variable = '$' + data.context.name;

    return {
        name: data.lineHeight,
        variable: variable,
        value: data.context.value
    };
};

// store spacing values to be exchanged by variable name
var spacingCache = {};

var spacing = function (data) {
    var value = data.context.value.match(/^\$/i) ? spacingCache[data.context.value] : data.context.value;
    var variable = '$' + data.context.name;
    var group = data.group || 'Base';

    spacingCache[variable] = value;

    return {
        name: data.spacing,
        variable: variable,
        value: value,
        group: group
    };
};

var timing = function (data) {
    var variable = '$' + data.context.name;

    // override value by @value value if exists
    var value = data.value || data.context.value;

    return {
        name: data.timing,
        variable: variable,
        value: value
    };
};

var transition = function (data) {
    var variable = '$' + data.context.name;

    // override value by @value value if exists
    var value = data.value || data.context.value;

    return {
        name: data.transition,
        variable: variable,
        value: value
    };
};

var DataPreparator = function() {

};

DataPreparator.prototype.create = function(data, dest) {
    var fonts = [],
        fontSizes = [],
        colors = [],
        colorsByGroup = [],
        lineHeights = [],
        boxShadows = [],
        gradients = [],
        spacings = [],
        spacingsByGroup = [],
        timings = [],
        transitions = [],
        repo;

    var filename;

    for (filename in data) {
        if (data.hasOwnProperty(filename)) {
            var file = data[filename];

            if (file.length) {
                file.forEach(function (item) {
                    if (item.hasOwnProperty('color')) {
                        colors.push(color(item));
                    } else if (item.hasOwnProperty('font')) {
                        fonts.push(font(item));
                    } else if (item.hasOwnProperty('fontSize')) {
                        fontSizes.push(fontSize(item));
                    } else if (item.hasOwnProperty('lineHeight')) {
                        lineHeights.push(lineHeight(item));
                    } else if (item.hasOwnProperty('boxShadow')) {
                        boxShadows.push(boxShadow(item));
                    } else if (item.hasOwnProperty('gradient')) {
                        gradients.push(gradient(item));
                    } else if (item.hasOwnProperty('spacing')) {
                        spacings.push(spacing(item));
                    } else if (item.hasOwnProperty('timing')) {
                        timings.push(timing(item));
                    } else if (item.hasOwnProperty('transition')) {
                        transitions.push(transition(item));
                    }
                });
            }
        }
    }

    // colors by group
    var colorGroupMap = {};

    colors.forEach(function (item) {
        var index;

        // create new group if not exists
        if (!colorGroupMap.hasOwnProperty(item.group)) {
            index = colorGroupMap[item.group] = colorsByGroup.length;
            colorsByGroup[index] = { name: item.group, colors: []};
        } else {
            index = colorGroupMap[item.group];
        }

        colorsByGroup[index].colors.push(item);
    });

    // spacings by group
    var spacingGroupMap = {};

    spacings.forEach(function (item) {
        var index;

        // create new group if not exists
        if (!spacingGroupMap.hasOwnProperty(item.group)) {
            index = spacingGroupMap[item.group] = spacingsByGroup.length;
            spacingsByGroup[index] = { name: item.group, spacings: []};
        } else {
            index = spacingGroupMap[item.group];
        }

        spacingsByGroup[index].spacings.push(item);
    });

    // Build repo
    repo = {
        colors: colors,
        colorsByGroup: colorsByGroup,
        fonts: fonts,
        fontSizes: fontSizes,
        lineHeights: lineHeights,
        boxShadows: boxShadows,
        gradients: gradients,
        spacings: spacings,
        spacingsByGroup: spacingsByGroup,
        timings: timings,
        transitions: transitions
    };

    // Create destination directory if not exists
    try {
        fs.accessSync(path.dirname(dest), fs.R_OK | fs.W_OK);
    } catch (err) {
        fs.ensureDir(path.dirname(dest));
    }

    fs.writeJsonSync(dest, repo);

    return repo;
};
