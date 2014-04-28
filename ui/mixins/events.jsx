'use strict';

var _        = require('underscore');
var mediator = require('../../lib/mediator');

/**
 * This is a React component mixin that handles subscribing to mediator events
 * throughout the component lifecycle.
 *
 * Calling this.subscribe in your component has the same signature as
 * mediator.subscribe, but with the added benefit that your event handlers
 * will automatically be removed from the mediator when the component
 * unmounts.
 *
 * For the best results, you typically want to start listening to events
 * during `componentWillMount`. Publishing events when a component is mounted
 * should happen during `componentDidMount`. This will give all of your
 * components the chance to start listening before any events are published.
 */
module.exports = {

    componentWillMount : function()
    {
        this.eventSubscriptions = [];
    },

    subscribe : function()
    {
        var args = _.toArray(arguments);
        this.eventSubscriptions.push(args);
        return mediator.subscribe.apply(mediator, args);
    },

    unsubscribe : function()
    {
        this.eventSubscriptions = _.without(this.eventSubscriptions, arguments);
        return mediator.unsubscribe.apply(mediator, arguments);
    },

    publish : function()
    {
        return mediator.publish.apply(mediator, arguments);
    },

    componentWillUnmount : function()
    {
        _.each(this.eventSubscriptions, function(subscription) {
            mediator.unsubscribe.apply(mediator, subscription);
        });
    }
};
