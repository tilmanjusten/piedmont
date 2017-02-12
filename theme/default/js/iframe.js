;(function (window, _) {
    'use strict';

    // vars
    var list;
    var document = window.document;

    /**
     * collect iframe wrappers, fetch content and prepare
     */
    var collect = function() {
        var iframeWrappers = document.querySelectorAll('.styleguide-iframe');

        for (var i = 0, length = iframeWrappers.length; i < length; i++) {
            var element = iframeWrappers[i];
            var markup = element.innerHTML;

            if (!markup) {
                return;
            }

            list.push({
                element: element,
                markup: markup,
                data: element.dataset
            });
        }
    };

    /**
     * insert template content
     */
    var insert = function() {
        list.forEach(function (set) {
            // clear element content
            set.element.innerHTML = '';

            // prepare and append iframe
            prepareIframe(set.element, set.markup, set.data);
        });
    };

    /**
     * Prepare iframe element
     *
     * @param parent
     * @param markup
     * @param data
     */
    var prepareIframe = function (parent, markup, data) {
        // Create a new blank iframe
        var newIframe = document.createElement('iframe');
        // Set attributes for iFrame (do whatever suits)
        newIframe.width = '100%';
        newIframe.height = '100%';
        // This for the src makes it 'friendly'
        newIframe.src = 'about:blank';

        var resources = JSON.parse(_.unescape(data.resources));
        var stylesHead = resources.stylesHead.files.map(function (path) {
            return '<link rel="stylesheet" href="' + path + '">';
        });
        var stylesHeadInline = resources.stylesHead.inline.map(function (content) {
            return '<style>' +  content + '</style>';
        });
        var scriptsHead = resources.scriptsHead.files.map(function (path) {
            return '<script src="' + path + '"></script>';
        });
        var scriptsHeadInline = resources.scriptsHead.inline.map(function (content) {
            return '<script>' +  content + '</script>';
        });
        var scriptsFoot = resources.scriptsFoot.files.map(function (path) {
            return '<script src="' + path + '"></script>';
        });
        var scriptsFootInline = resources.scriptsFoot.inline.map(function (content) {
            return '<script>' +  content + '</script>';
        });

        // Set Meta data
        var META = '<base href="assets/">\n' + resources.meta.map(function (metaItem) {
                // filter <base> tag to prevent collision
                if (metaItem.search(/<base/i)) {
                    return '';
                }

                return metaItem;
            }).join('\n');

        // List any CSS you want to reference within the iframe
        var CSS = '<link rel="stylesheet" href="../css/iframe.css">';
        CSS += stylesHead.join('\n');
        CSS += stylesHeadInline.join('\n');

        // List any JS you want to reference within the iframe
        var JS = scriptsHead.join('\n') + scriptsHeadInline.join('\n');
        var JSFoot = scriptsFoot.join('\n') + scriptsFootInline.join('\n');

        // Now stitch it all together into one thing to insert into the iframe
        var myContent = '';

        myContent += '<!DOCTYPE html><html><head><title>Rendered HTML Component</title>';
        myContent += META;
        myContent += CSS;
        myContent += JS;
        myContent += '</head><body>';
        myContent += markup;
        myContent += JSFoot;
        myContent += '</body></html>';

        // Attach iframe element
        parent.appendChild(newIframe);

        // Use the JavaScript methods to write to the iFrame, then close it
        var iframeDocument = newIframe.contentWindow.document;

        newIframe.addEventListener('load', updateIframe);

        iframeDocument.open();
        iframeDocument.write(myContent);
        iframeDocument.close();

        // classnames
        var rootClassContent = _.trim(resources.classnames.root);
        rootClassContent.replace(/\s+/ig, ' ').split(' ').map(function (classname) {
            try {
                newIframe.contentDocument.documentElement.classList.add(classname);
            } catch (err) {}
        });

        // add body classnames when the iframe load is complete
        newIframe.addEventListener('load', function () {
            var bodyClassContent = _.trim(resources.classnames.body);
            bodyClassContent.replace(/\s+/ig, ' ').split(' ').map(function (classname) {
                try {
                    newIframe.contentDocument.body.classList.add(classname);
                } catch (err) {}
            });
        });
    };

    var updateIframe = function () {
        var iframe = this;
        var iframeDocument = iframe.contentWindow.document;
        var body = iframeDocument.body, html = iframeDocument.documentElement;

        iframe.height = Math.max(
            body.scrollHeight,
            body.offsetHeight,
            html.clientHeight,
            html.scrollHeight,
            html.offsetHeight
        );

        iframe.style.minHeight = '';
    };

    // run on dom ready
    document.addEventListener("DOMContentLoaded", function () {
        list = [];
        collect();
        insert();
    });

})(window, _);
