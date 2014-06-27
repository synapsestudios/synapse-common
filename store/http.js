'use strict';

var BaseStore    = require('./base');
var HttpGateway  = require('../http/gateway');

var HttpStore = BaseStore.extend(HttpGateway.prototype);

module.exports = HttpStore;
