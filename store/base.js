'use strict';

/**
 * This exports a Store class that is not really meant to be used standalone, but
 * should be extended by the implementer. Its purpose is to get the boilerplate
 * of extending EventEmitter out of the way.
 */

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;

var Store = function() {};
_.extend(Store.prototype, EventEmitter.prototype);

// Basically Backbone's extend
Store.extend = function(protoProps) {
    var parent = this;
    var child;

    if (protoProps && _.has(protoProps, 'constructor')) {
        child = protoProps.constructor;
    } else {
        child = function() { return parent.apply(this, arguments); };
    }

    _.extend(child, parent);

    var Surrogate = function() { this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate();

    if (protoProps) {
        _.extend(child.prototype, protoProps);
    }

    child.__super__ = parent.prototype;

    return child;
};

module.exports = Store;
