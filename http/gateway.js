'use strict';

var _            = require('underscore');
var Q            = require('q');
var http         = require('http');
var HttpError    = require('./error');
var Extendable   = require('./extendable');

var HttpGateway = Extendable.extend({

    getConfig : function() {
        if (this.config) {
            return this.config;
        }

        throw 'You must extend getConfig or set this.config with a hostname and port';
    },

    _getRequestOptions : function(method, path)
    {
        var config = this.getConfig();

        return {
            hostname : config.hostname,
            port     : config.port,
            method   : method,
            path     : path,
            headers  : {
                'Accept'       : 'application/json',
                'Content-Type' : 'application/json'
            }
        };
    },

    apiRequest : function(method, path, data)
    {
        return Q.Promise(_.bind(function(resolve, reject) {
            this.beginSync();
            var options  = this._getRequestOptions(method, path);

            var req = http.request(options, function(response) {
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
                        reject(new HttpError(responseData, response));
                    } else {
                        resolve(responseData);
                    }
                });
            });

            req.on('error', function(e) {
                reject(e);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        }, this));
    }

});

module.exports = HttpGateway;
