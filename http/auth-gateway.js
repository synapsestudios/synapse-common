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
     * {@inheritDoc}
     */
    handleError : function(response, responseData, resolve, reject, method, path, data, headers)
    {
        if (response.statusCode === 401) {
            this.handle401(resolve, reject, method, path, data, headers);

            return;
        }

        HttpGateway.prototype.handleError(response, responseData, resolve, reject, method, path, data, headers);
    },

    /**
     * Handle 401 Unauthorized responses
     *
     * Assume that the oauth access token has expired and the refresh token
     * needs to be exchanged for a new one.
     *
     * The successful response of the refresh token exchange request will be
     * in the following shape:
     * {
     *     "access_token" : "6339f1a7...",
     *     "expires_in"   : 3600,
     *     "token_type"   : "bearer",
     *     "scope"        : null,
     *     "user_id"      : "1"
     * }
     */
    handle401 : function(resolve, reject, method, path, data, headers)
    {
        var gateway, token, refreshData, refreshHeaders, handleSuccess, handleFailure;

        gateway = this;
        token   = store.get('token');

        data = data || {};

        handleSuccess = function (response) {
            token = _.extend(token, response);

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
