/**
 * Adapted from ChaplinJS (http://chaplinjs.org/)
 */

'use strict';

var _        = require('underscore'),
    Backbone = require('backbone'),
    handlers, mediator, support,
    __slice = [].slice;

support = {
    propertyDescriptors: (function() {
        var o;
        if (!(typeof Object.defineProperty === 'function' && typeof Object.defineProperties === 'function')) {
            return false;
        }

        try {
            o = {};
            Object.defineProperty(o, 'foo', {
                value: 'bar'
            });
            return o.foo === 'bar';
        } catch (error) {
            return false;
        }
    })()
};


mediator             = {};
mediator.subscribe   = Backbone.Events.on;
mediator.unsubscribe = Backbone.Events.off;
mediator.publish     = Backbone.Events.trigger;
mediator._callbacks  = null;
handlers             = mediator._handlers = {};

mediator.setHandler = function(name, method, instance) {
    return handlers[name] = {
        instance : instance,
        method   : method
    };
};

mediator.execute = function() {
    var args, handler, name, nameOrObj, silent;
    nameOrObj = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    silent = false;
    if (typeof nameOrObj === 'object') {
        silent = nameOrObj.silent;
        name = nameOrObj.name;
    } else {
        name = nameOrObj;
    }
    handler = handlers[name];
    if (handler) {
        return handler.method.apply(handler.instance, args);
    } else if (!silent) {
        throw new Error("mediator.execute: " + name + " handler is not defined");
    }
};

mediator.removeHandlers = function(instanceOrNames) {
    var handler, name, _i, _len;
    if (!instanceOrNames) {
        mediator._handlers = {};
    }
    if (_.isArray(instanceOrNames)) {
        for (_i = 0, _len = instanceOrNames.length; _i < _len; _i+=1) {
            name = instanceOrNames[_i];
            delete handlers[name];
        }
    } else {
        for (name in handlers) {
            handler = handlers[name];
            if (handler.instance === instanceOrNames) {
                delete handlers[name];
            }
        }
    }
};

mediator.seal = function() {
    if (support.propertyDescriptors && Object.seal) {
        return Object.seal(mediator);
    }
};

module.exports = mediator;