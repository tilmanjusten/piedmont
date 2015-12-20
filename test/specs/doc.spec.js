'use strict';

var fs = require('fs-extra'),
    resolve = require('path').resolve,
    expect = require('chai').expect,
    Doc = require('../../lib/docs/doc');

describe("Document", function () {
    var doc,
        content;

    before(function () {
        content = fs.readFileSync(resolve(__dirname, '../fixtures/lib/doc.md'), 'utf8');
    });

    beforeEach(function () {
        doc = new Doc(content);
    });

    it('should parse full content and get poster and content', function () {
        var expectedContent = '\n\n# The content\n\n' +
                'is not that extensive.',
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

    it('should substitue content in template', function () {
        var expected = fs.readFileSync(resolve(__dirname, '../expectations/lib/doc-simple-template.html'), 'utf8'),
            templateCode = fs.readFileSync(resolve(__dirname, '../fixtures/lib/doc-simple-template.html'), 'utf8');

        doc.parseContent();
        doc.setTemplate(templateCode);

        expect(doc.make()).to.equal(expected);
    });

    it('should substitue content and poster in template', function () {
        var expected = fs.readFileSync(resolve(__dirname, '../expectations/lib/doc-poster-template.html'), 'utf8'),
            templateCode = fs.readFileSync(resolve(__dirname, '../fixtures/lib/doc-poster-template.html'), 'utf8');

        doc.parseContent();
        doc.setTemplate(templateCode);

        expect(doc.make()).to.equal(expected);
    });
});