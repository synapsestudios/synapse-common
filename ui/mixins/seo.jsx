'use strict';

var _        = require('underscore');
var window   = require('jswindow-shim');
var $        = require('../../loaders/jquery')(window);

module.exports = {
    componentDidMount : function()
    {
        if ( ! this.displayName) {
            throw 'displayName must be set on a component in order to use the SEO mixin';
        }

        if ( ! this.seo) {
            throw 'Missing SEO object';
        }

        if (this.seo.title) {
            this.updateTitle(this.seo.title);
        }

        if (this.seo.meta) {
            this.updateMeta(this.seo.meta);
        }

        if (this.seo.favicon) {
            this.updateFavicon(this.seo.favicon);
        }
    },

    componentWillUnmount : function()
    {
        $('meta[data-route]').remove();
    },

    updateTitle : function(title)
    {
        if (_.isString(title)) {
            window.document.title = title;
            return;
        }

        if (_.isFunction(title)) {
            window.document.title = title(this.props);
            return;
        }

        throw 'Wrong type for title on route ' + this.displayName;
    },

    updateMeta : function(meta)
    {
        var name = this.displayName;

        if (_.isFunction(meta)) {
            meta = meta(this.props);
        }

        if (! _.isArray(meta)) {
            throw 'meta must be an array or a callback that returns an array (route: ' + name + ')';
        }

        $('meta[data-route]').remove();

        _.each(meta, function(tag) {
            var newTag = $('<meta>');

            newTag.attr('data-route', name);

            _.each(tag, function(value, name) {
                newTag.prop(name, value);
            });

            $('head').append(newTag);
        });
    },

    updateFavicon : function(favicon, params)
    {
        if (_.isFunction(favicon)) {
            favicon = favicon(params);
        }

        $('link[rel=icon]').attr('href', favicon);
    }
};