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

module.exports = Store;
