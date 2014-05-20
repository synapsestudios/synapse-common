'use strict';

var _         = require('underscore');
var HttpStore = require('./http');

var AuthStore = HttpStore.extend({
    setTokenStore : function(tokenStore)
    {
        this.tokenStore = tokenStore;
    },

    _getRequestOptions : function(method, path)
    {
         var options = HttpStore.prototype._getRequestOptions.apply(this, arguments);

         if (! this.tokenStore) {
            throw "Missing tokenStore";
         }

         options.headers = options.headers || {};
         options.headers = _.extend(options.headers, {
            Authorization : 'Bearer ' + this.tokenStore.getAccessToken()
         });

        return options;
    }
});

module.exports = AuthStore;
