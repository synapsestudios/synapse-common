/* global window */
'use strict';

var _        = require('underscore');
var Backbone = require('backbone');
var History  = require('./history');
var Route    = require('./route');

var escapeRegExp = function(str)
{
    return String(str || '').replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
};

function Router(options)
{
    var isWebFile;

    this.options = options != null ? options : {};
    this.match   = _.bind(this.match, this);

    try {
        isWebFile    = window.location.protocol !== 'file:';
    } catch (e) {
        isWebFile    = false;
    }

    _.defaults(this.options, {
        pushState : isWebFile,
        root      : '/',
        trailing  : false
    });

    this.removeRoot = new RegExp('^' + escapeRegExp(this.options.root) + '(#)?');
    this.createHistory();
}

Router.extend = Backbone.Model.extend;

Router.prototype.createHistory = function()
{
    return (Backbone.history = new History());
};

Router.prototype.startHistory = function()
{
    return Backbone.history.start(this.options);
};

Router.prototype.stopHistory = function()
{
    if (Backbone.History.started)
    {
        return Backbone.history.stop();
    }
};

Router.prototype.findHandler = function(predicate)
{
    var handler, _i, _len, _ref;
    _ref = Backbone.history.handlers;
    for (_i = 0, _len = _ref.length; _i < _len; _i+=1) {
        handler = _ref[_i];
        if (predicate(handler)) {
            return handler;
        }
    }
};

Router.prototype.match = function(pattern, name, target, options)
{
    var route;

    options = options || {};

    _.defaults(options, {
        trailing : this.options.trailing
    });

    options.name = name;

    route = new Route(pattern, target, options);

    Backbone.history.handlers.push({
        route    : route,
        callback : route.handler
    });

    return route;
};

Router.prototype.route = function(pathDesc, params, options)
{
    var handler, path;

    if (typeof pathDesc === 'object')
    {
        path = pathDesc.url;
        if ( ! params && pathDesc.params)
        {
            params = pathDesc.params;
        }
    }

    params = params ? _.isArray(params) ? params.slice() : _.extend({}, params) : {};

    if (path != null)
    {
        path    = path.replace(this.removeRoot, '');

        handler = this.findHandler(function(handler)
        {
            return handler.route.test(path);
        });

        options = params;
        params  = null;
    }
    else
    {
        options = options ? _.extend({}, options) : {};

        handler = this.findHandler(function(handler)
        {
            if (handler.route.matches(pathDesc))
            {
                params = handler.route.normalizeParams(params);

                if (params)
                    return true;

            }

            return false;
        });
    }

    if (handler)
    {
        _.defaults(options, {
            changeURL : true
        });

        handler.callback(path || params, options);

        return true;
    }
    else
    {
        throw new Error('Router#route: request was not routed');
    }
};

Router.prototype.reverse = function(criteria, params, query)
{
    var handler, handlers, reversed, root, url, _i, _len;

    root = this.options.root;

    if ((params != null) && typeof params !== 'object')
    {
        throw new TypeError('Router#reverse: params must be an array or an ' + 'object');
    }

    handlers = Backbone.history.handlers;

    for (_i = 0, _len = handlers.length; _i < _len; _i+=1)
    {
        handler = handlers[_i];

        // Reverse match routes by name only
        if (handler.route.name !== criteria)
        {
            continue;
        }

        reversed = handler.route.reverse(params, query);

        if (reversed !== false)
        {
            url = root ? root + reversed : reversed;
            return url;
        }
    }

    throw new Error('Router#reverse: invalid route specified');
};

Router.prototype.changeURL = function(params, route, options)
{
    var navigateOptions, url;

    if ( ! ((route.path !== null) && options.changeURL)) {
        return;
    }

    url = route.path + (route.query ? "?" + route.query : "");

    navigateOptions = {
        trigger: options.trigger === true,
        replace: options.replace === true
    };

    return Backbone.history.navigate(url, navigateOptions);
};

Router.prototype.disposed = false;

Router.prototype.dispose = function()
{
    if (this.disposed)
        return;

    this.stopHistory();

    delete Backbone.history;

    this.disposed = true;

    return typeof Object.freeze === "function" ? Object.freeze(this) : void 0;
};

module.exports = Router;