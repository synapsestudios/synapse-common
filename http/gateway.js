'use strict';

var _            = require('underscore');
var Q            = require('q');
var http         = require('http');
var https        = require('https');
var HttpError    = require('./error');
var Extendable   = require('../lib/extendable');

var HttpGateway = Extendable.extend({

    getConfig : function() {
        if (this.config) {
            return this.config;
        }

        throw 'You must extend getConfig or set this.config with a hostname and port';
    },

    /**
     * Perform a request to the API
     *
     * @param  string  method   Request method
     * @param  string  path     Request path
     * @param  object  data     Request data (if any)
     * @param  object  headers  Additional headers (if any)
     * @return promise
     */
    apiRequest : function(method, path, data, headers)
    {
        var gateway = this;

        if (data && method === 'GET') {
            path = path + '?' + this._toQuery(data);
        }

        if (_.isUndefined(headers)) {
            headers = {};
        }

        return Q.Promise(_.bind(function(resolve, reject) {
            var options = this._getRequestOptions(method, path);

            _.extend(options.headers, headers);

            var req = (gateway.getConfig().secure ? https : http).request(options, function(response) {
                var responseText = '';

                response.on('data', function(chunk) {
                    responseText += chunk;
                });

                response.on('end', function() {
                    var responseData;

                    try {
                        responseData = JSON.parse(responseText);
                    } catch (e) {
                        responseData = responseText;
                    }

                    if (response.statusCode >= 400) {
                        if (response.statusCode === 401) {
                            this.handle401(method, path, data, headers, resolve, reject);
                        }
                        reject(new HttpError(responseData, response));
                    } else {
                        resolve(responseData);
                    }
                });
            });

            req.on('error', function(e) {
                reject(e);
            });

            if (data && method !== 'GET') {
                if (_.isObject(data)) {
                    data = JSON.stringify(data);
                }

                req.write(data);
            }

            req.end();
        }, this));
    },

    /**
     * Called when an api request fails with a 401
     *
     * @param  function method
     * @param  string   path
     * @param  mixed    data
     * @param  function resolve
     * @param  function reject
     */
    handle401 : function(method, path, data, headers, resolve, reject)
    {
        // override point
    },

    _getRequestOptions : function(method, path)
    {
        var config;

        config = this.getConfig();

        return {
            hostname        : config.hostname,
            port            : config.port,
            method          : method,
            path            : path,
            withCredentials : (config.withCredentials === true),
            headers         : {
                'Accept'       : 'application/json',
                'Content-Type' : 'application/json'
            }
        };
    },

    /**
     * Encode data in object format
     *
     * @param  object data Query data in object form
     * @return string
     */
    _toQuery : function(data)
    {
        return this._buildParams('', data);
    },

    /**
     * Build query parameters
     *
     * Taken from underscore-contrib, freely distributed under the MIT license.
     * @link https://github.com/documentcloud/underscore-contrib/blob/master/underscore.util.strings.js
     *
     * @param  string prefix Prefix to add before param
     * @param  mixed  val    Variable to parameterize
     * @param  bool   top    Is this a recursive call to this function?
     * @return string
     */
    _buildParams : function(prefix, val, top)
    {
        var instance = this;

        if (_.isUndefined(top)) top = true;

        if (_.isArray(val)) {
            return _.map(val, function(value, key) {
                return instance._buildParams(top ? key : prefix + '[]', value, false);
            }).join('&');
        } else if (_.isObject(val)) {
            return _.map(val, function(value, key) {
                return instance._buildParams(top ? key : prefix + '[' + key + ']', value, false);
            }).join('&');
        } else {
            return this._urlEncode(prefix) + '=' + this._urlEncode(val);
        }
    },

    /**
     * Encode a string to be used in a URL
     *
     * Taken from underscore-contrib, freely distributed under the MIT license.
     * @link https://github.com/documentcloud/underscore-contrib/blob/master/underscore.util.strings.js
     *
     * @param  string string String to encode
     * @return string
     */
    _urlEncode : function(string) {
        return encodeURIComponent(string).replace(/\%20/g, '+');
    }

});

module.exports = HttpGateway;
