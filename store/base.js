'use strict';

var Extendable   = require('../lib/extendable');
var EventEmitter = require('events').EventEmitter;

var BaseStore = Extendable.extend(EventEmitter.prototype);

module.exports = BaseStore;
