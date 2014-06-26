'use strict';

var HttpGateway  = require('../http/gateway');
var EventEmitter = require('events').EventEmitter;

var HttpStore = HttpGateway.extend(EventEmitter.prototype);

module.exports = HttpStore;
