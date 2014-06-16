'use strict';

var _            = require('underscore');
var Q            = require('q');
var http         = require('http');
var HttpError    = require('./http-error');
var BaseStore    = require('./base');
var SyncMachine  = require('../lib/sync-machine');

var CHANGE = 'change',
    ERROR  = 'error';

var HttpStore = BaseStore.extend({

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
            var self     = this;

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
                        self.abortSync();
                        reject(new HttpError(responseData, response));
                    } else {
                        self.finishSync();
                        self.emit(CHANGE);
                        resolve(responseData);
                    }
                });
            });

            req.on('error', function(e) {
                reject(e);

                this.abortSync();
                self.emit(ERROR, e);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        }, this));
    }

});

_.extend(HttpStore.prototype, SyncMachine);

module.exports = HttpStore;
