'use strict';

var Hammer;

try {
    Hammer = require('hammerjs');
} catch (err) {
    Hammer = function() {
        return { on : function() {}, off : function() {} };
    };
}

module.exports = Hammer;