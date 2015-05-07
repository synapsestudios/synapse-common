'use strict';
/* globals window */

var _       = require('underscore');
var Fluxxor = require('fluxxor');

/**
 * Usage:
 *
 * In stores.js:
 *
 * var params = {
 *     queries : {
 *         alias1 : 'some-media-query-string'
 *     },
 *     default : alias1
 * };
 *
 * modules.exports = {
 *     MatchMediaStore : new MatchMediaStore(params)
 * };
 *
 * In a component's getStateFromFlux method:
 *
 * this.setState({
 *     mq : matchMediaStore.getMatches()
 * });
 */
module.exports = Fluxxor.createStore({

    initialize : function(params)
    {
        var store = this;

        this.mqls = _.map(params.queries, function(query, alias) {
            var mql = {
                matches : alias === params.default
            };

            if (
                typeof window !== 'undefined' &&
                typeof window.matchMedia !== 'undefined'
            ) {
                mql = window.matchMedia(query);

                mql.addListener(store.emit.bind(store, 'change'));
            }

            return mql;
        });
    },

    getMatches : function()
    {
        return _.map(this.mqls, function (query) {
            return query.matches;
        });
    },

    fromObject : function(state)
    {
        this.mqls = state.mqls;
    },

    toObject : function()
    {
        return {
            mqls : this.mqls
        };
    }
});
