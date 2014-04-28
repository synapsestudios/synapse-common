'use strict';

module.exports = function(win) {
    var $ = require('jquery');

    if ( ! $.fn || ! $.fn.jquery) {
        $ = $(win);
    }

    return $;
};