'use strict';

var _     = require('underscore');
var React = require('react');

module.exports = {
    propTypes : {
        stores : React.PropTypes.object.isRequired
    },

    _boundListener : null,

    componentWillMount : function() {
        if (! _.isFunction(this.getStateFromStores)) {
            return;
        }

        var self = this;
        this._boundListener = _.bind(function() {
            self.setState(self.getStateFromStores());
        }, self);

        _.each(this.props.stores, function(store) {
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
