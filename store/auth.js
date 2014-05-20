'use strict';

var _         = require('underscore');
var HttpStore = require('./http');

var AuthStore = function() {};

_.extend(AuthStore.prototype, HttpStore.prototype);

AuthStore.prototype.setTokenStore = function(tokenStore)
{
    this.tokenStore = tokenStore;
};

AuthStore.prototype._getRequestOptions = function(method, path)
{
     var options = HttpStore.prototype._getRequestOptions.apply(this, arguments);

     if (! this.tokenStore) {
        throw "Missing tokenStore";
     }

     options.headers = _.extend(options.headers, {
        Authorization : 'Bearer ' + this.tokenStore.getAccessToken()
     });

    return options;
};

module.exports = AuthStore;
