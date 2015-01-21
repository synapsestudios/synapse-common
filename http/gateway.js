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

        if (_.isUndefined(headers)) {
            headers = {};
        }

        return Q.Promise(function(resolve, reject) {
            var options = gateway.getRequestOptions(method, path, data);

            _.extend(options.headers, headers);

            var req = (gateway.getConfig().secure ? https : http).request(options, function(response) {
                var responseText = '';

                response.on('data', function(chunk) {
                    responseText += chunk;
                });

                response.on('end', function() {
                    var responseData, shouldReject;

                    try {
                        responseData = JSON.parse(responseText);
                    } catch (e) {
                        responseData = responseText;
                    }

                    if (response.statusCode >= 400) {
                        if (response.statusCode === 401) {
                            shouldReject = gateway.handle401(resolve, reject, method, path, data, headers);
                        }

                        if (response.statusCode !== 401 || shouldReject === true) {
                            reject(new HttpError(responseData, response));
                        }
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
        });
    },

    getRequestOptions : function(method, path, data)
    {
        var config, queryString;

        config = this.getConfig();

        if (data && method === 'GET') {
            queryString = this.toQuery(data);

            if (queryString) {
                path = path + '?' + queryString;
            }
        }

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
    toQuery : function(data)
    {
        return this.buildParams('', data);
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
    buildParams : function(prefix, val, top)
    {
        var instance = this;

        if (_.isUndefined(top)) top = true;

        if (_.isArray(val)) {
            return _.map(val, function(value, key) {
                return instance.buildParams(top ? key : prefix + '[]', value, false);
            }).join('&');
        } else if (_.isObject(val)) {
            return _.map(val, function(value, key) {
                return instance.buildParams(top ? key : prefix + '[' + key + ']', value, false);
            }).join('&');
        } else {
            return this.urlEncode(prefix) + '=' + this.urlEncode(val);
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
    urlEncode : function(string)
    {
        return encodeURIComponent(string).replace(/\%20/g, '+');
    },

    /**
     * Handle 401 Unauthorized responses
     *
     * Return true to indicate that 401 will not be handled
     */
    handle401 : function(resolve, reject, method, path, data, headers)
    {
        return true;
    }

});

module.exports = HttpGateway;
