'use strict';

var HttpGateway = require('./gateway');
var store       = require('store');
var qs          = require('querystring');
var constants   = require('../constants');

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
    },

    handle401 : function(method, path, data, headers, resolve, reject)
    {
        // attempt refresh by calling
        this.refresh()
            .then(function(payload) {
                this.flux.dispatch(constants.TOKEN_REFRESHED, payload);
                this.apiRequest(method, path, data, headers).then(resolve).fail(reject);
            })
            .fail(function(){
                reject();
                this.flux.dispatch(constants.LOGOUT);
            });
    },

    refresh : function()
    {
        var token = store.get('token') || {};

        return this.apiRequest(
            'POST',
            '/oauth/token',
            qs.stringify({
                grant_type    : 'refresh_token',
                client_id     : this.config.client_id,
                refresh_token : token.refresh_token
            })
        );
    }

});

module.exports = HttpAuthGateway;
