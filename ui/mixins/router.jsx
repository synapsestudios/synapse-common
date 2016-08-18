/** @jsx React.DOM */
'use strict';

var _        = require('underscore');
var window   = require('../../lib/jswindow-shim.js');
var $        = require('../../loaders/jquery')(window);
var Router   = require('../../lib/router');
var mediator = require('../../lib/mediator');

module.exports = {

    router         : null,
    routingStarted : false,
    nextId         : 1,

    componentDidMount : function()
    {
        this.initRouter();
    },

    getInitialState : function() {
        return {
            componentName : null,
            props         : null
        };
    },

    updatePage : function(routeMatch, params, routeOptions)
    {
        this.setState({
            componentName : routeMatch.target,
            params        : params,
            queryParams   : this.getQueryParams(),
            routeOptions  : routeOptions
        });

        if (routeOptions) {
            if (routeOptions.title) {
                this.updateTitle(routeOptions.title, params, routeOptions.name);
            }

            if (routeOptions.meta) {
                this.updateMeta(routeOptions.meta, params, routeOptions.name);
            }

            if (routeOptions.favicon) {
                this.updateFavicon(routeOptions.favicon, params);
            }
        }
    },

    updateTitle : function(title, params, name)
    {
        name = name || '[unknown]';
        if (_.isString(title)) {
            window.document.title = title;
            return;
        }

        if (_.isFunction(title)) {
            window.document.title = title(params);
            return;
        }

        throw "Wrong type for title on route " + name;
    },

    updateMeta : function(meta, params, name)
    {
        if (_.isFunction(meta)) {
            meta = meta(params);
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
    },

    getUrl : function()
    {
        return window.location.href;
    },

    navigate : function(handler)
    {
        this.router.navigate.bind(this.router, handler, {
            trigger : true
        });
    },

    navigateBack : function()
    {
        window.history.go.bind(window.history, -1);
    },

    initRouter : function()
    {
        this._routes      = this.routes || {};
        this._routePrefix = this.routePrefix || '';

        if (this.props.router)
        {
            this.router = this.props.router;
        }

        if ( ! this.router)
        {
            this.router = new Router();
            this.router.createHistory();
        }

        mediator.subscribe('router:match', _.bind(this.updatePage, this));

        _.each(this._routes, _.bind(function(data, name)
        {
            var component = data.component,
                _route    = data.route,
                options   = data.options;

            this.router.match(_route, name, component, options);
        }, this));

        this.router.startHistory();
    },

    getQueryParams : function()
    {
        var uri, queryString, querySeparatorIndex;

        uri = window.location.search;

        querySeparatorIndex = uri.indexOf('?');

        queryString = uri.substring(querySeparatorIndex + 1);


        return this.extractQueryParams(queryString);
    },

    /**
     * Extract params from a query string
     *
     * Borrowed from Chaplin.js v1.0.0 utils.queryParams.parse
     * @param  string queryString
     * @return object
     */
    extractQueryParams : function(queryString)
    {
        var current, field, pair, pairs, params, value, _i, _len, _ref;

        params = {};

        if (!queryString) {
            return params;
        }

        pairs = queryString.split('&');

        for (_i = 0, _len = pairs.length; _i < _len; _i+=1) {
            pair = pairs[_i];

            if (!pair.length) {
                continue;
            }

            _ref  = pair.split('=');
            field = _ref[0];
            value = _ref[1];

            if (!field.length) {
                continue;
            }

            field = decodeURIComponent(field);
            value = decodeURIComponent(value);

            current = params[field];

            if (current) {
                if (current.push) {
                    current.push(value);
                } else {
                    params[field] = [current, value];
                }
            } else {
                params[field] = value;
            }
        }

        return params;
    }
};
