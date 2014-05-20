'use strict';

var _            = require('underscore');
var http         = require('http');
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
            path     : path
        };
    },

    apiRequest : function(method, path, data, cb)
    {
        this.beginSync();
        var options = this._getRequestOptions(method, path);

        var self = this;

        var req = http.request(options, function(response) {
            var responseText = '';

            response.on('data', function(chunk) {
                responseText += chunk;
            });

            response.on('end', function() {
                if (_.isFunction(cb)) {
                    var json;
                    try {
                        json = JSON.parse(responseText);
                    } catch (e) {
                        cb({ error: e }, response);
                        return;
                    }

                    cb(false, JSON.parse(responseText));
                    return;
                }

                this.finishSync();
                self.emit(CHANGE);
            });
        });

        req.on('error', function(e) {
            if (_.isFunction(cb)) {
                cb(e);
            }

            this.abortSync();
            self.emit(ERROR, e);
        });

        if (data) {
            req.write(JSON.stringify(data));
        }

        req.end();
    }

});

_.extend(HttpStore.prototype, SyncMachine);

module.exports = HttpStore;
