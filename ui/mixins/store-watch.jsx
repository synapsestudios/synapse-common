'use strict';

var _     = require('underscore');
var React = require('react');

module.exports = {
    propTypes : {
        stores : React.propTypes.array
    },

    _boundListener : null,

    componentWillMount : function() {
        if (! _.isFunction(this.getStateFromStores)) {
            return;
        }

        var self;
        _.each(this.props.stores, function(store) {
            self._boundListener = _.bind(self.getStateFromStores, self);
            store.on('change', self._boundListener);
        });
    },

    componentWillUnmount : function() {
        if (! _.isFunction(this.getStateFromStores)) {
            return;
        }

        var self;
        _.each(this.props.stores, function(store) {
            store.removeListener('change', self._boundListener);
        });
    }
};
