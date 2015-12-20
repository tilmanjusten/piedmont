'use strict';

var markdown = require('../../lib/docs/markdown'),
    expect = require('chai').expect,
    fs = require('fs-extra'),
    resolve = require('path').resolve;

describe('Markdown', function () {

    describe('convert markdown to (higlighted) html', function () {
       it('should return html for markdown input', function () {
           var fixture = '# Headline\nThis is content',
               expectation = '<h1 id="headline">Headline</h1>\n<p>This is content</p>\n';

           expect(markdown.convert(fixture)).to.equal(expectation);
       });

        it('should highlight code blocks', function () {
            var fixture = fs.readFileSync(resolve(__dirname, '../fixtures/docs/code.md'), 'utf8'),
                expectation = fs.readFileSync(resolve(__dirname, '../expectations/docs/code.html'), 'utf8');

            expect(markdown.convert(fixture)).to.equal(expectation);
        });
    });

    describe('get poster data from content', function () {
        it('should extract title from first headline', function () {
            var fixture = fs.readFileSync(resolve(__dirname, '../fixtures/docs/poster-from-content.md'), 'utf8'),
                expectation = {title: 'Get poster data from content'},
                falseExpectation = {title: 'Subheadline'};

            expect(markdown.poster(fixture)).to.deep.equal(expectation);
            expect(markdown.poster(fixture)).to.not.equal(falseExpectation);
        });
    });
});

