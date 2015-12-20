'use strict';

var fs = require('fs-extra'),
    expect = require('chai').expect,
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
        var expectedContent = '\n\n# The content\n\n' +
                'is not that extensively.',
            expectedPoster = '---\n' +
                'title: Document example\n' +
                'parent: examples\n' +
                'class: document-body-classname\n' +
                '---';


        doc.parseContent();

        expect(doc.content).to.equal(expectedContent);
        expect(doc.poster).to.equal(expectedPoster);
    });

    it('should get data from poster', function () {
        var expectedPosterData = {
            title: 'Document example',
            class: 'document-body-classname',
            parent: 'examples'
        };

        doc.parseContent();

        expect(doc.getPosterValuesFromPoster()).to.deep.equal(expectedPosterData);
    });

    it('should merge poster defaults with poster from content', function () {
        var expectedPosterData = {
            title: 'Document example',
            class: 'document-body-classname',
            layout: 'default',
            parent: 'examples'
        };

        doc.parseContent();
        doc.preparePosterData();

        expect(doc.posterData).to.deep.equal(expectedPosterData);
    });
});