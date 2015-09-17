'use strict';

var _            = require('lodash');
var EventEmitter = require('events').EventEmitter;

var Dispatcher = function() {};
_.extend(Dispatcher.prototype, EventEmitter.prototype);

module.exports = new Dispatcher();
