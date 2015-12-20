'use strict';

var markdown = require('../lib/docs/markdown'),
    assert = require('assert'),
    fs = require('fs-extra');

describe('Markdown', function () {

    describe('convert markdown to (higlighted) html', function () {
       it('should return html for markdown input', function () {
           var fixture = '# Headline\nThis is content',
               expect = '<h1 id="headline">Headline</h1>\n<p>This is content</p>\n';

           assert.equal(markdown.convert(fixture), expect);
       });

        it('should highlight code blocks', function () {
            var fixture = fs.readFileSync(__dirname + '/fixtures/docs/code.md', 'utf8'),
                expect = fs.readFileSync(__dirname + '/expectations/docs/code.html', 'utf8');

            assert.equal(markdown.convert(fixture), expect);
        });
    });

    describe('get poster data from content', function () {
        it('should extract title from first headline', function () {
            var fixture = fs.readFileSync(__dirname + '/fixtures/docs/poster-from-content.md', 'utf8'),
                expect = {title: 'Get poster data from content'},
                notExpect = {title: 'Subheadline'};

            assert.deepEqual(markdown.poster(fixture), expect);
            assert.notEqual(markdown.poster(fixture), notExpect);
        });
    });
});

