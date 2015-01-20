'use strict';

var config      = require('../config');
var HttpGateway = require('synapse-common/http/auth-gateway');
var qs          = require('querystring');
var store       = require('store');

var OAuthClient = HttpGateway.extend({

    config : config.api,

    login : function(email, password)
    {
        return this.apiRequest(
            'POST',
            '/oauth/token',
            qs.stringify({
                username      : email,
                password      : password,
                grant_type    : 'password',
                client_id     : this.config.client_id,
                client_secret : this.config.client_secret
            })
        );
    },

    logout : function()
    {
        var token = store.get('token') || {};

        return this.apiRequest(
            'POST',
            '/oauth/logout',
            {
                refresh_token : token.refresh_token
            }
        );
    },

    _getRequestOptions : function(method, path)
    {
        var options;

        options = HttpGateway.prototype._getRequestOptions.call(this, method, path);

        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';

        return options;
    }
});

module.exports = new OAuthClient();
