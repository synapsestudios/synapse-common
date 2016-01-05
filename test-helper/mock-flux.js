'use strict';

var _     = require('lodash');
var sinon = require('sinon');

var Flux = function(stores, actions) {
    this.dispatcher = {dispatch : sinon.spy()};

    this.stores = stores;

    this.actions = {};
    this.bindActions(actions, this.actions);
};

Flux.prototype.store = function(name) {
    return this.stores[name];
};

// Recursively add actions to the flux object and bind them to the dispatcher
Flux.prototype.bindActions = function(actions, attachTo)
{
    var flux = this;

    _.each(actions, function(value, name) {
        if (_(value).isFunction()) {
            attachTo[name] = value.bind(flux.dispatcher);
        } else {
            attachTo[name] = {};
            flux.bindActions(value, attachTo[name]);
        }
    });
};

module.exports = Flux;
