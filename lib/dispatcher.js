'use strict';

var _            = require('underscore');
var EventEmitter = require('events').EventEmitter;

var Dispatcher = function() {};
_.extend(Dispatcher.prototype, EventEmitter.prototype);

module.exports = new Dispatcher();
