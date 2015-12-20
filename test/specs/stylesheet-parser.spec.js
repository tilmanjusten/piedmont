'use strict';

var fs = require('fs-extra'),
    _ = require('lodash'),
    path = require('path'),
    expect = require('chai').expect,
    stylesheetParser = require('../../lib/stylesheet-parser'),
    expectations = fs.readJsonSync(path.resolve(__dirname, '../expectations/stylesheet-parser.json'));

function getFixture(annotation, cb) {
    stylesheetParser(path.resolve(__dirname, '../fixtures/styles/' + annotation + '.scss'), cb);
}

describe('StylesheetParser', function () {
    describe('@annotations', function () {

        it('should match expected for @borderRadius', function (done) {
            getFixture('borderRadius', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.borderRadius);
                done();
            });
        });

        it('should match expected for @boxShadow', function (done) {
            getFixture('boxShadow', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.boxShadow);
                done();
            });
        });

        it('should match expected for @color', function (done) {
            getFixture('color', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.color);
                done();
            });
        });

        it('should match expected for @component', function (done) {
            getFixture('component', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.component);
                done();
            });
        });

        it('should match expected for @example', function (done) {
            getFixture('example', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.example);
                done();
            });
        });

        it('should match expected for @font', function (done) {
            getFixture('font', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.font);
                done();
            });
        });

        it('should match expected for @fontFamily', function (done) {
            getFixture('fontFamily', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.fontFamily);
                done();
            });
        });

        it('should match expected for @fontSize', function (done) {
            getFixture('fontSize', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.fontSize);
                done();
            });
        });

        it('should match expected for @fontStyle', function (done) {
            getFixture('fontStyle', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.fontStyle);
                done();
            });
        });

        it('should match expected for @fontWeight', function (done) {
            getFixture('fontWeight', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.fontWeight);
                done();
            });
        });

        it('should match expected for @group', function (done) {
            getFixture('group', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.group);
                done();
            });
        });

        it('should match expected for @gradient', function (done) {
            getFixture('gradient', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.gradient);
                done();
            });
        });

        it('should match expected for @lineHeight', function (done) {
            getFixture('lineHeight', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.lineHeight);
                done();
            });
        });

        it('should match expected for @spacing', function (done) {
            getFixture('spacing', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.spacing);
                done();
            });
        });

        it('should match expected for @timing', function (done) {
            getFixture('timing', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.timing);
                done();
            });
        });

        it('should match expected for @transition', function (done) {
            getFixture('transition', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.transition);
                done();
            });
        });

        it('should match expected for @type', function (done) {
            getFixture('type', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.type);
                done();
            });
        });

        it('should match expected for @value', function (done) {
            getFixture('value', function (err, result) {
                var section = _.values(result)[0];
                expect(section).to.deep.equal(expectations.value);
                done();
            });
        });
    });
});
