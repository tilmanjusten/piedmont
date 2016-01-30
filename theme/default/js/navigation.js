;(function (window, $) {
    'use strict';

    $(window.document).on('ready', function () {
        var $toggle = $('.styleguide-navigation-toggle'),
            $navigation = $('.styleguide-navigation');

        $toggle.on('click touchstart', function (evt) {
            evt.preventDefault();

            $toggle.toggleClass('active');
            $navigation.toggleClass('active');
        });
    });
})(window, jQuery);