/* globals window */
'use strict';

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
 *     default : 'alias1'
 * };
 *
 * modules.exports = {
 *     MatchMediaStore : new MatchMediaStore(params)
 * };
 *
 * In a component's getStateFromFlux method:
 *
 * return {
 *     mq : matchMediaStore.getMatches()
 * };
 *
 * getMatches() returns an object of boolean values corresponding to the configured media queries
 * {
 *     alias1 : true
 * }
 *
 * When rendering on the server the default query is set to true
 */
module.exports = Fluxxor.createStore({

    initialize : function(params)
    {
        var defaultMatch, queries, store;

        store = this;

        if (_.has(params, 'queries') && _.has(params, 'default')) {
            queries      = params.queries;
            defaultMatch = params.default;
        } else {
            queries      = params;
            defaultMatch = null;
        }

        this.mqls = _.mapObject(queries, function (query, alias) {
            var mql = {
                matches : alias === defaultMatch
            };

            if (
                typeof window !== 'undefined' &&
                typeof window.matchMedia === 'function'
            ) {
                mql = window.matchMedia(query);

                mql.addListener(store.emit.bind(store, 'change'));
            }

            return mql;
        });
    },

    /**
     * Returns an object of boolean values corresponding to the currently matched media queries.
     */
    getMatches : function()
    {
        return _.mapObject(this.mqls, function (query) {
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
