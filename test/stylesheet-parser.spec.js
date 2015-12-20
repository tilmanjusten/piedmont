'use strict';

var fs = require('fs-extra'),
    _ = require('lodash'),
    assert = require('assert'),
    stylesheetParser = require('../lib/stylesheet-parser'),
    expectations = fs.readJsonSync(__dirname + '/expectations/stylesheet-parser.json');

function getFixture(annotation, cb) {
    stylesheetParser(__dirname + '/fixtures/styles/' + annotation + '.scss', cb);
}

describe('StylesheetParser', function () {
    describe('@annotations', function () {

        it('should match expected for @borderRadius', function (done) {
            getFixture('borderRadius', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.borderRadius);
                done();
            });
        });

        it('should match expected for @boxShadow', function (done) {
            getFixture('boxShadow', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.boxShadow);
                done();
            });
        });

        it('should match expected for @color', function (done) {
            getFixture('color', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.color);
                done();
            });
        });

        it('should match expected for @component', function (done) {
            getFixture('component', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.component);
                done();
            });
        });

        it('should match expected for @example', function (done) {
            getFixture('example', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.example);
                done();
            });
        });

        it('should match expected for @font', function (done) {
            getFixture('font', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.font);
                done();
            });
        });

        it('should match expected for @fontFamily', function (done) {
            getFixture('fontFamily', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.fontFamily);
                done();
            });
        });

        it('should match expected for @fontSize', function (done) {
            getFixture('fontSize', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.fontSize);
                done();
            });
        });

        it('should match expected for @fontStyle', function (done) {
            getFixture('fontStyle', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.fontStyle);
                done();
            });
        });

        it('should match expected for @fontWeight', function (done) {
            getFixture('fontWeight', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.fontWeight);
                done();
            });
        });

        it('should match expected for @group', function (done) {
            getFixture('group', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.group);
                done();
            });
        });

        it('should match expected for @gradient', function (done) {
            getFixture('gradient', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.gradient);
                done();
            });
        });

        it('should match expected for @lineHeight', function (done) {
            getFixture('lineHeight', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.lineHeight);
                done();
            });
        });

        it('should match expected for @spacing', function (done) {
            getFixture('spacing', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.spacing);
                done();
            });
        });

        it('should match expected for @timing', function (done) {
            getFixture('timing', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.timing);
                done();
            });
        });

        it('should match expected for @transition', function (done) {
            getFixture('transition', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.transition);
                done();
            });
        });

        it('should match expected for @type', function (done) {
            getFixture('type', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.type);
                done();
            });
        });

        it('should match expected for @value', function (done) {
            getFixture('value', function (err, result) {
                var fixture = _.values(result)[0];
                assert.deepEqual(fixture, expectations.value);
                done();
            });
        });
    });
});
