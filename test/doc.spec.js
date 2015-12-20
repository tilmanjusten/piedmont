'use strict';

var assert = require('assert'),
    fs = require('fs-extra'),
    Doc = require('../lib/docs/doc');

describe("Document", function () {
    var doc,
        content;

    before(function () {
        content = fs.readFileSync(__dirname + '/fixtures/lib/doc.md', 'utf8');
    });

    beforeEach(function () {
        doc = new Doc(content);
    });

    it('should parse full content and get poster and content', function () {
        var expectedContent = '# The content\n\n' +
                'is not that extensively.\n',
            expectedPoster = '---\n' +
                'title: Document example\n' +
                'parent: examples\n' +
                'class: document-body-classname\n' +
                '---\n';


        doc.parseContent();

        assert(doc.content, expectedContent);
        assert(doc.poster, expectedPoster);
    });

    it('should get data from poster', function () {
        var expect = {
            title: 'Document example',
            class: 'document-body-classname',
            parent: 'examples'
        };

        doc.parseContent();

        assert.deepEqual(doc.getPosterValuesFromPoster(), expect);
    });

    it('should merge poster defaults with poster from content', function () {
        var expect = {
            title: 'Document example',
            class: 'document-body-classname',
            layout: 'default',
            parent: 'examples'
        };

        doc.parseContent();
        doc.preparePosterData();

        assert.deepEqual(doc.posterData, expect);
    });
});