'use strict';

var BaseStore       = require('./base');
var HttpAuthGateway = require('../http/auth-gateway');

var AuthStore = BaseStore.extend(HttpAuthGateway.prototype);

module.exports = AuthStore;
