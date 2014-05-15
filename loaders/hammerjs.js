'use strict';

var Hammer;

try {
    // You are responsible for making sure hammerjs is available in the browser
    // if you want to use it. Browserify will not do it automatically by including
    // this file!
    var req = require;
    Hammer = req('hammerjs');
} catch (err) {
    Hammer = function() {
        return { on : function() {}, off : function() {} };
    };
}

module.exports = Hammer;