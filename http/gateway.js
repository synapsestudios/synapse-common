/* globals File, FileReader, Buffer, Uint8Array */
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

        throw new Error('You must extend getConfig or set this.config with a hostname and port');
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
        var reader, boundaryKey, gateway = this;

        if (_.isUndefined(headers)) {
            headers = {};
        }

        return Q.Promise(function(resolve, reject) {
            var options = gateway.getRequestOptions(method, path, data);

            _.extend(options.headers, headers);

            if (data instanceof File) {
                boundaryKey = Math.random().toString(16);
                options.headers['Content-Type'] = 'multipart/form-data; boundary=' + boundaryKey;
                options.headers['Content-Length'] = data.size;
            }

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
                        gateway.handleError(
                            response,
                            responseData,
                            resolve,
                            reject,
                            method,
                            path,
                            data,
                            headers,
                            options
                        );
                    } else {
                        gateway.handleSuccess(
                            resolve,
                            responseData,
                            req.xhr.getAllResponseHeaders(),
                            response.statusCode
                        );
                    }
                });
            });

            req.on('error', function(e) {
                reject(e);
            });

            if (data && method !== 'GET') {
                if (data instanceof File) {
                    reader = new FileReader();
                    reader.onloadend = function () {
                        req.write(gateway.getUploadPayload(data, reader.result, boundaryKey));
                        req.end();
                    };
                    reader.readAsArrayBuffer(data);
                } else if (_.isObject(data)) {
                    data = JSON.stringify(data);
                    req.write(data);
                    req.end();
                } else {
                    req.write(data);
                    req.end();
                }
            } else {
                req.end();
            }
        });
    },

    /**
     * Get a Uint8Array that can be passed to request.write() to upload a file
     *
     * @param  {File} file                   File object
     * @param  {ArrayBuffer} fileArrayBuffer
     * @param  {String} boundaryKey
     * @return {Uint8Array}
     */
    getUploadPayload : function(file, fileArrayBuffer, boundaryKey)
    {
        var prefix, suffix, dataString, payloadString, payloadTypedArray;

        prefix        = this.getBodyPrefixForFileUpload(file, boundaryKey);
        suffix        = '\r\n--' + boundaryKey + '--\r\n';
        dataString    = this.convertArrayBufferToString(fileArrayBuffer);
        payloadString = prefix + dataString + suffix;

        payloadTypedArray = new Uint8Array(payloadString.length);
        for (var i = 0; i < payloadString.length; i += 1) {
            payloadTypedArray[i] = payloadString.charCodeAt(i);
        }

        return payloadTypedArray;
    },

    /**
     * Convert an ArrayBuffer to a binary string
     *
     * @param  {ArrayBuffer} arrayBuffer
     * @return {String}
     */
    convertArrayBufferToString : function(arrayBuffer)
    {
        var buffer;

        buffer = new Buffer(new Uint8Array(arrayBuffer));

        return buffer.toString('binary');
    },

    /**
     * Prepare headers for file payload section of the request
     *
     * @param file
     * @param boundaryKey
     * @returns {string}
     */
    getBodyPrefixForFileUpload : function(file, boundaryKey)
    {
        return (
            '--' + boundaryKey + '\r\n' +
            'Content-Disposition: form-data; name="file"; filename="' + file.name + '"\r\n' +
            'Content-Type: application/octet-stream\r\n\r\n'
        );
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

        if (config.prefix) {
            path = config.prefix + path;
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

    handleSuccess : function(resolve, data, headers, statusCode)
    {
        // By default only return the data. Can be overridden if necessary.
        resolve(data);
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
     * Handle API request errors
     *
     * @param  {Object}   response     The API response
     * @param  {Mixed}    responseData The data returned in the response
     * @param  {Function} resolve      The success callback
     * @param  {Function} reject       The fail callback
     * @param  {String}   method       The failed request's method
     * @param  {String}   path         The failed request's path
     * @param  {Object}   data         The failed request body data (if any)
     * @param  {Object}   headers      The extra headers set on the failed request
     * @param  {Object}   options      The request options
     */
    handleError : function(response, responseData, resolve, reject, method, path, data, headers, options)
    {
        reject(new HttpError(responseData, response));
    }

});

module.exports = HttpGateway;
