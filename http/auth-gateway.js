'use strict';

var HttpGateway = require('./gateway');
var store       = require('store');
var qs          = require('querystring');
var _           = require('underscore');

var HttpAuthGateway = HttpGateway.extend({

    getRequestOptions : function(method, path, data)
    {
        var options, token;

        options = HttpGateway.prototype.getRequestOptions.call(this, method, path, data);

        token = store.get('token');
        if (token) {
            options.headers.Authorization = 'Bearer' + ' ' + token.access_token;
        }

        return options;
    },

    /**
     * Handle 401 Unauthorized responses
     *
     * Assume that the oauth access token has expired and the refresh token
     * needs to be exchanged for a new one.
     */
    handle401 : function(resolve, reject, method, path, data, headers)
    {
        var gateway, token, refreshData, refreshHeaders, handleSuccess, handleFailure;

        gateway = this;
        token   = store.get('token');

        data = data || {};

        handleSuccess = function (accessToken) {
            token = _.extend(token, accessToken);

            store.set('token', token);

            gateway.apiRequest(method, path, data, headers).then(resolve, reject);
        };

        handleFailure = function (errors) {
            // Noop
        };

        refreshData = qs.stringify({
            client_id     : this.config.client_id,
            grant_type    : 'refresh_token',
            refresh_token : token.refresh_token
        });

        refreshHeaders = {'Content-Type' : 'application/x-www-form-urlencoded'};

        this.apiRequest('POST', '/oauth/token', refreshData, refreshHeaders).then(handleSuccess, handleFailure);
    }

});

module.exports = HttpAuthGateway;
