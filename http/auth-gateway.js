/* globals window */
'use strict';

var HttpGateway = require('./gateway');
var store       = require('store2');
var qs          = require('querystring');
var _           = require('lodash');
var dispatcher  = require('../lib/dispatcher');

var refreshingToken = false;

var HttpAuthGateway = HttpGateway.extend({

    /**
     * Location in localStorage to store and retrieve the OAuth token
     *
     * @type {String}
     */
    tokenStorageLocation : 'token',

    /**
     * Prefix for the authorization header
     *
     * @type {String}
     */
    authorizationHeaderPrefix : 'Bearer ',

    /**
     * {@inheritDoc}
     */
    getRequestOptions : function(method, path, data)
    {
        var options, token;

        options = HttpGateway.prototype.getRequestOptions.call(this, method, path, data);

        token = store.get(this.tokenStorageLocation);
        if (token) {
            options.headers.Authorization = this.authorizationHeaderPrefix + token.access_token;
        }

        return options;
    },

    getCurrentAccessToken : function()
    {
        return store.get(this.tokenStorageLocation).access_token;
    },

    /**
     * {@inheritDoc}
     */
    handleError : function(
        response,
        responseData,
        resolve,
        reject,
        method,
        path,
        data,
        requestHeaders,
        options,
        responseHeaders
    ) {
        if (response.statusCode === 401 && requestHeaders.Authorization) {
            return this.handle401(resolve, reject, method, path, data, requestHeaders);
        }

        HttpGateway.prototype.handleError(response, responseData, resolve, reject, method, path, data, requestHeaders);
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
     *
     * @param  {Function} resolve  Success callback of original request
     * @param  {Function} reject   Failre callback of original request
     * @param  {String}   method   HTTP method of original request
     * @param  {String}   path     URI path of original request
     * @param  {Object}   data     Data sent in original request
     * @param  {Object}   headers  Headers sent in original request
     */
    handle401 : function(resolve, reject, method, path, data, headers)
    {
        var gateway, token, handleSuccess, tokenJustUpdated, accessToken;

        accessToken = headers.Authorization.substring(this.authorizationHeaderPrefix.length);

        // token was just updated
        if (accessToken !== this.getCurrentAccessToken()) {
            headers.Authorization = this.authorizationHeaderPrefix + this.getCurrentAccessToken();
            return this.apiRequest(method, path, data, headers)
                .then(resolve, reject);
        }

        gateway = this;
        token   = store.get(this.tokenStorageLocation);

        if (refreshingToken === false) {
            refreshingToken = true;

            data = data || {};

            handleSuccess = _.partial(
                this.handleTokenExchangeSuccess.bind(this),
                token,
                method,
                path,
                data,
                headers,
                resolve,
                reject
            );

            this.makeTokenExchangeRequest(
                token.refresh_token,
                handleSuccess,
                _.bind(this.handleTokenExchangeFailure, this)
            );
        }

        dispatcher.once('TOKEN_REFRESH_SUCCESS', function () {
            debugger;
            // Delete Authorization header so that it gets replaced with the updated token
            delete headers.Authorization;

            gateway.apiRequest(method, path, data, headers).then(resolve, reject);
        });
    },

    /**
     * Handle successful exchange of refresh token for new access token by:
     *     1. Saving the token details in localStorage
     *     2. Re-trying the API request that initially failed with a 401
     *     3. Disabling the localStorage flag that says we are currently doing a token exchange
     *     4. Emit an event to notify other 401-failed API calls that it's time to re-try.
     *
     * @param  {Object}   token    Token data currently in localStorage
     * @param  {String}   method   HTTP method of original request
     * @param  {String}   path     URI path of original request
     * @param  {Object}   data     Data sent in original request
     * @param  {Object}   headers  Headers sent in original request
     * @param  {Function} resolve  Success callback of original request
     * @param  {Function} reject   Failre callback of original request
     * @param  {Object}   response Response of refresh token exchange request
     */
    handleTokenExchangeSuccess : function(token, method, path, data, headers, resolve, reject, response)
    {
        token = _.extend(token, response);

        store.set(this.tokenStorageLocation, token);

        refreshingToken = false;
        dispatcher.emit('TOKEN_REFRESH_SUCCESS');
    },

    /**
     * Handle a failure to exchange a refresh token for a new access token by routing to login URL
     */
    handleTokenExchangeFailure : function()
    {
        var config = this.getConfig();

        store.clear();

        if (config.login_url) {
            window.location = config.login_url;
        } else {
            window.location = '/';
        }
    },

    /**
     * Make a request to the API to exchange a refresh token for a new access token
     *
     * @param  {Function} handleSuccess Callback to handle success
     * @param  {Function} handleFailure Callback to handle failure
     */
    makeTokenExchangeRequest : function(refreshToken, handleSuccess, handleFailure)
    {
        var refreshData, refreshHeaders, tokenUri;

        refreshData = qs.stringify({
            client_id     : this.config.client_id,
            grant_type    : 'refresh_token',
            refresh_token : refreshToken
        });

        refreshHeaders = {'Content-Type' : 'application/x-www-form-urlencoded'};

        if (this.config.oauth && this.config.oauth.token) {
            tokenUri = this.config.oauth.token;
        } else {
            throw new Error(
                'Oauth endpoints not configured. \'token\' and \'login\' endpoints should be set in config.api.oauth'
            );
        }

        this.apiRequest('POST', tokenUri, refreshData, refreshHeaders).then(
            handleSuccess,
            handleFailure
        );
    }
});

module.exports = HttpAuthGateway;
