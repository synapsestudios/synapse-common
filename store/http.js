'use strict';

var _            = require('underscore');
var http         = require('http');
var EventEmitter = require('events').EventEmitter;

var CHANGE = 'change',
    ERROR  = 'error';

var HttpStore = function() {};

_.extend(HttpStore, EventEmitter);

HttpStore.prototype.getConfig = function() {
    if (this.config) {
        return this.config;
    }

    throw 'You must extend getConfig or set this.config with a hostname and port';
};

HttpStore.prototype._getRequestOptions = function(method, path)
{
    var config = this.getConfig();

    return {
        hostname : config.hostname,
        port     : config.port,
        method   : method,
        path     : path
    };
};

HttpStore.prototype.apiRequest = function(method, path, data)
{
    var options = this._getRequestOptions(method, path);

    var self = this;

    var req = http.request(options, function(response) {
        var responseText = '';

        response.on('data', function(chunk) {
            responseText += chunk;
        });

        response.on('end', function() {
            self.emit(CHANGE);
        });
    });

    req.on('error', function(e) {
        self.emit(ERROR, e);
    });

    if (data) {
        req.write(JSON.stringify(data));
    }

    req.end();
};

module.exports = HttpStore;
