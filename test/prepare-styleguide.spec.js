'use strict';

var fs = require('fs-extra'),
    prepareStyleguide = require('../lib/prepare-styleguide'),
    assert = require('assert');

describe('PrepareStyleguide', function () {
    describe('building styleguide', function () {
        var styleguide;

        before(function (done) {
            fs.emptyDir(__dirname + '/.tmp', function () {});

            var stylesheetParserData = fs.readJsonSync(__dirname + '/fixtures/lib/stylesheet-parser-data.json');

            prepareStyleguide(stylesheetParserData, __dirname + '/.tmp/prepare-styleguide-result.json', function (err, result) {
                styleguide = result;
                done();
            });
        });

        after(function () {
            fs.removeSync(__dirname + '/.tmp', function () {});
        });

        it('should write data to json file', function () {
            assert.doesNotThrow(function () {
                fs.accessSync(__dirname + '/.tmp/prepare-styleguide-result.json', fs.R_OK);
            });
        });

        it('should ensure section colors exists', function () {
            assert.ok(styleguide.colors);
        });

        it('should ensure section colorsByGroup exists', function () {
            assert.ok(styleguide.colorsByGroup);
        });

        it('should ensure section fonts exists', function () {
            assert.ok(styleguide.fonts);
        });

        it('should ensure the fonts TheSans has three font weights 300, 400 and 700', function () {
            assert.deepEqual(styleguide.fonts[0].weights, ["300", "400", "700"]);
        });

        it('should ensure section fontSizes exists', function () {
            assert.ok(styleguide.fontSizes);
        });

        it('should ensure section boxShadows exists', function () {
            assert.ok(styleguide.boxShadows);
        });

        it('should ensure section gradients exists', function () {
            assert.ok(styleguide.gradients);
        });

        it('should ensure the type of the third gradient is radial', function () {
            assert.equal(styleguide.gradients[2].type, 'radial');
        });

        it('should ensure section spacings exists', function () {
            assert.ok(styleguide.spacings);
        });

        it('should ensure section spacingsByGroup exists', function () {
            assert.ok(styleguide.spacingsByGroup);
        });

        it('should ensure section timings exists', function () {
            assert.ok(styleguide.timings);
        });

        it('should ensure section transitions exists', function () {
            assert.ok(styleguide.transitions);
        });
    })
});