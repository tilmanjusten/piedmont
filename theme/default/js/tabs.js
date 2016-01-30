;(function (window, $) {
    'use strict';

    var defaults = {
        moduleSelector: '.tab',
        container: '<div></div>',
        labelSelector: '.tab__label'
        },
        options = {},
        $window;

    var prepare,
        scaffold,
        open,
        prepareLinks,
        activateSelectedTab;

    /**
     * prepare tab groups
     */
    prepare = function () {
        $window = $(window);
        options = $.extend({}, defaults);

        var $tabs = $(options.moduleSelector);

        // Stop if there is just one tab element
        if ($tabs.length < 2) {
            return this;
        }

        var groups = [];
        var itGroup = -1;

        // determine groups
        $tabs.each(function () {
            var $panel = $(this);

            // continue if already initialized
            if ($panel.data('initialized')) {
                return;
            }

            $panel.data('initialized', true);

            if (false === $panel.prev().hasClass(options.moduleSelector.replace(/\./, ''))) {
                itGroup++;
                groups[itGroup] = [];
            }

            groups[itGroup].push($panel);
        });

        groups.map(function (group, i) {
            scaffold(group, i);
        });

        activateSelectedTab();
    };

    /**
     * build dom
     * @param group
     * @param itGroup
     */
    scaffold = function (group, itGroup) {
        var $wrapper = $(options.container).addClass('tab');
        var $content = $('<div></div>').addClass('tab__content');
        var $navigation = $('<ul></ul>').addClass('tab__nav');
        var $firstTab = $(group[0]);

        // accessibility
        $navigation.attr('role', 'tablist');

        // build markup
        $wrapper.append($navigation).append($content);
        $firstTab.before($wrapper);

        for (var i = 0; i < group.length; i++) {
            var classnames = group[i].attr('class');
            var $panel = group[i].attr('class', '').addClass('tab__container');
            var label = $panel.data('label') || $panel.find(options.labelSelector).text();
            var idValue = itGroup + '-' + label.toLowerCase().replace(/[^\w]+/, '');
            var idTab = 'tab-' + idValue;
            var idPanel = 'pane-' + idValue;
            var $tab = $('<li></li>');
            var $tabAnchor = $('<a></a>');
            var isHighlighted = $panel.hasClass('highlighted');

            $wrapper.addClass(classnames);

            $tabAnchor.text(label).attr({href: '#' + idPanel});
            $tab
                .addClass('tab__nav-item')
                .append($tabAnchor)
                .attr({
                    id: idTab,
                    'aria-controls': '#' + idPanel,
                    'aria-selected': false
                });

            if (isHighlighted) {
                $tab.addClass('highlighted');
            }

            if (i === 0) {
                $tab.addClass('tab--active').attr({'aria-selected': true});
                $panel.addClass('pane--active');
            }

            // accessibility
            $panel.attr({
                id: idPanel,
                role: 'tabpanel',
                'aria-labelledby': '#' + idTab
            });

            // markup
            $navigation.append($tab);
            $content.append($panel);
            prepareLinks(idPanel, idTab);
        }

        $wrapper.on('touchstart click', '.tab__nav-item', open);
        $wrapper.addClass('tab--initialized');

        $window.on('hashchange', activateSelectedTab);
    };

    /**
     * Prepare links
     */
    prepareLinks = function(idPanel, idTab) {
      $('#' + idPanel + ' a').not('a[href="#"]').attr('href', function(i, href) {
        if (this.href.split('?')[0] === window.location.href.split('#')[0].split('?')[0]) {
          return href + '#' + idTab;
        }
      });
    };

    /**
     * Switch tab
     */
    open = function(evt) {
        evt.preventDefault();

        var $tab = $(this);

        if ($tab.hasClass('active')) {
            return;
        }

        var $navigation = $tab.closest('.tab__nav');
        var $panels = $navigation.closest(options.moduleSelector).find('.tab__container');
        var $panel = $panels.eq($tab.index());

        $tab
            .addClass('tab--active')
            .attr('aria-selected', true)
            .siblings()
            .removeClass('tab--active')
            .attr('aria-selected', false);

        $panels.removeClass('pane--active');
        $panel.addClass('pane--active');

        // add tab change to the browser history
        if (typeof window.history.pushState === 'function' && !evt.isTrigger) {
            // get url without hash, may be better than concatenating location parts (origin + ...)
            var url = window.location.href.split('#')[0];

            window.history.pushState({}, '', (url + '#' + $tab.attr('id')));
        }
    };

    /**
     * set selected tab to be active (selected by hash value in url)
     */
    activateSelectedTab = function () {
        var hash = window.location.hash;
        if (hash !== undefined && hash.length > 0) {
            $(hash).find('a').trigger('click');
        }
    };

    $(document).on('ready', prepare);

})(window, jQuery);
