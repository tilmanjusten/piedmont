'use strict';

var fs = require('fs-extra'),
    resolve = require('path').resolve,
    prepareStyleguide = require('../../lib/prepare-styleguide'),
    expect = require('chai').expect;

describe('PrepareStyleguide', function () {
    describe('building styleguide', function () {
        var styleguide;

        before(function (done) {
            fs.emptyDirSync(resolve(__dirname, '../.tmp'));

            var stylesheetParserData = fs.readJsonSync(resolve(__dirname, '../fixtures/lib/stylesheet-parser-data.json'));

            prepareStyleguide(stylesheetParserData, resolve(__dirname, '../.tmp/prepare-styleguide-result.json'), function (err, result) {
                styleguide = result;
                done();
            });
        });

        after(function () {
            fs.removeSync(resolve(__dirname, '../.tmp'), function () {});
        });

        it('should write data to json file', function () {
            expect(function () {
                fs.accessSync(resolve(__dirname, '../.tmp/prepare-styleguide-result.json'), fs.R_OK);
            }).to.not.throw(Error);
        });

        it('should ensure section colors exists', function () {
            expect(styleguide).to.have.any.key('colors');
        });

        it('should ensure section colorsByGroup exists', function () {
            expect(styleguide).to.have.any.key('colorsByGroup');
        });

        it('should ensure section fonts exists', function () {
            expect(styleguide).to.have.any.key('fonts');
        });

        it('should ensure the fonts TheSans has three font weights 300, 400 and 700', function () {
            expect(styleguide.fonts[0].weights).to.deep.equal(["300", "400", "700"]);
        });

        it('should ensure section fontSizes exists', function () {
            expect(styleguide).to.have.any.key('fontSizes');
        });

        it('should ensure section boxShadows exists', function () {
            expect(styleguide).to.have.any.key('boxShadows');
        });

        it('should ensure section gradients exists', function () {
            expect(styleguide).to.have.any.key('gradients');
        });

        it('should ensure the type of the third gradient is radial', function () {
            expect(styleguide.gradients[2].type).to.be.string('radial');
        });

        it('should ensure section spacings exists', function () {
            expect(styleguide).to.have.any.key('spacings');
        });

        it('should ensure section spacingsByGroup exists', function () {
            expect(styleguide).to.have.any.key('spacingsByGroup');
        });

        it('should ensure section timings exists', function () {
            expect(styleguide).to.have.any.key('timings');
        });

        it('should ensure section transitions exists', function () {
            expect(styleguide).to.have.any.key('transitions');
        });
    })
});