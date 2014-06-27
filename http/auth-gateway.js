'use strict';

var HttpGateway = require('./gateway');
var store       = require('store');

var HttpAuthGateway = HttpGateway.extend({

    _getRequestOptions : function(method, path)
    {
        var options, token;

        options = HttpGateway.prototype._getRequestOptions.call(this, method, path);

        token = store.get('token');
        if (token) {
            options.headers.Authorization = 'Bearer' + ' ' + token.access_token;
        }

        return options;
    }

});

module.exports = HttpAuthGateway;
