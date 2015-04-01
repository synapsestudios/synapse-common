'use strict';
/* globals window */

var _       = require('underscore');
var Fluxxor = require('fluxxor');

/**
 * Usage:
 *
 * In stores.js:
 *
 * modules.exports = {
 *     MatchMediaStore : new MatchMediaStore({
 *         alias1 : 'some-media-query-string'
 *     })
 * };
 *
 * In a component's getStateFromFlux method:
 *
 * this.setState({
 *     someStateProperty : matchMediaStore.mqls.alias1.matches ? 'this' : 'that'
 * });
 */
module.exports = Fluxxor.createStore({

    initialize : function(queries)
    {
        var store = this;

        this.mqls = {};

        _.each(queries, function(query, alias) {
            var mql;

            mql = window.matchMedia(query);

            mql.addListener(store.emitChange);

            store.mqls[alias] = mql;
        });
    },

    emitChange : function()
    {
        this.emit('change');
    }
});
