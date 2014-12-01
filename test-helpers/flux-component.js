'use strict';

var React     = require('react');
var Fluxxor   = require('fluxxor');
var fluxMixin = Fluxxor.FluxMixin(React);

/**
 * For testing components that use FluxChildMixin
 */
module.exports = React.createClass({

    propTypes : {
        Child : React.PropTypes.func,
        props : React.PropTypes.object,
        flux  : React.PropTypes.object
    },

    mixins : [fluxMixin],

    render : function()
    {
        this.props.props.ref = 'testedComponent';

        return this.props.Child(this.props.props);
    }
});
