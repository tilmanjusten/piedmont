;(function (window, $) {
    'use strict';

    $(document).on('ready', function () {
        var $body = $('body'),
            $options = $('.styleguide-options'),
            $info = $('<button></button>')
                .addClass('styleguide-options__toggle styleguide-options__toggle--info')
                .text('Info');

        $info.appendTo($options);

        $info.on('click', function () {
            if ($info.hasClass('styleguide-options--info')) {
                $info.removeClass('styleguide-options--info');
                $body.removeClass('styleguide-options--info');
            } else {
                $info.addClass('styleguide-options--info');
                $body.addClass('styleguide-options--info');
            }
        });
    });
})(window, jQuery);