'use strict';

var Piedmont = require('../../index').Piedmont,
    expect = require('chai').expect,
    path = require('path');

describe('Piedmont', function () {

    describe('options', function () {

        it('should equal the defaults if no option is overridden', function () {
            var pm = new Piedmont(),
                fixture = {
                    theme: path.resolve(__dirname, '../..', 'theme/default'),
                    tmp: path.resolve(__dirname, '../..', '.tmp'),
                    cwd: path.resolve(__dirname, '../..'),
                    dest: path.resolve(__dirname, '../..', 'dist/styling-guidelines'),
                    src: path.resolve(__dirname, '../..', 'test/fixtures/build'),
                    styles: path.resolve(__dirname, '../..', 'test/fixtures/styles'),
                    docs: path.resolve(__dirname, '../..', 'test/fixtures/docs'),
                    inventory: true
                };

            expect(pm.options).to.deep.equal(fixture);
        });

        it('should treat options as boolean false for docs and styles if type of the given value is not `string`', function () {
            var pm = new Piedmont({
                styles: null,
                docs: true
            });

            expect(pm.options.docs).to.equal(false);
            expect(pm.options.styles).to.equal(false);
        });

        it('should override defaults by given params', function () {
            var pm = new Piedmont({
                    dest: 'styleguide',
                    inventory: false,
                    tmp: '.tmp',
                    theme: 'theme/light',
                    docs: 'docs'
                }),
                fixture = {
                    theme: path.resolve(__dirname, '../..', 'theme/light'),
                    tmp: path.resolve(__dirname, '../..', '.tmp'),
                    cwd: path.resolve(__dirname, '../..'),
                    dest: path.resolve(__dirname, '../..', 'styleguide'),
                    src: path.resolve(__dirname, '../..', 'test/fixtures/build'),
                    styles: path.resolve(__dirname, '../..', 'test/fixtures/styles'),
                    docs: path.resolve(__dirname, '../..', 'docs'),
                    inventory: false
                };

            expect(pm.options).to.deep.equal(fixture);
        });
    });
});