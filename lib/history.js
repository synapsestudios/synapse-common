/* global window,document,setInterval */
'use strict';

var _        = require('underscore');
var Backbone = require('backbone');

var routeStripper = /^[#\/]|\s+$/g,
    rootStripper  = /^\/+|\/+$/g,
    trailingSlash = /\/$/;

module.exports = Backbone.History.extend({
    getFragment : function(fragment, forcePushState) {
        var root;
        if (!(fragment != null)) {
            if (this._hasPushState || !this._wantsHashChange || forcePushState) {
                fragment = this.location.pathname + this.location.search;
                root = this.root.replace(trailingSlash, '');
                if (!fragment.indexOf(root)) {
                    fragment = fragment.substr(root.length);
                }
            } else {
                fragment = this.getHash();
            }
        }
        return fragment.replace(routeStripper, '');
    },

    start : function(options) {
        var atRoot, fragment, loc;

        if (Backbone.History.started)
        {
            throw new Error('Backbone.history has already been started');
        }

        Backbone.History.started = true;

        this.options = _.extend({}, {
            root: '/'
        }, this.options, options);

        this.root             = this.options.root;
        this._wantsHashChange = this.options.hashChange !== false;
        this._wantsPushState  = Boolean(this.options.pushState);
        this._hasPushState    = Boolean(this.options.pushState && this.history && this.history.pushState);
        fragment              = this.getFragment();
        this.root             = ('/' + this.root + '/').replace(rootStripper, '/');

        if (this._hasPushState)
        {
            Backbone.$(window).on('popstate', this.checkUrl);
        }
        else if (this._wantsHashChange && 'onhashchange' in window)
        {
            Backbone.$(window).on('hashchange', this.checkUrl);
        }
        else if (this._wantsHashChange)
        {
            this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
        }

        this.fragment = fragment;
        loc           = this.location;
        atRoot        = loc.pathname.replace(/[^\/]$/, '$&/') === this.root;

        if (this._wantsHashChange && this._wantsPushState && !this._hasPushState && !atRoot)
        {
            this.fragment = this.getFragment(null, true);
            this.location.replace(this.root + '#' + this.fragment);
            return true;
        }
        else if (this._wantsPushState && this._hasPushState && atRoot && loc.hash)
        {
            this.fragment = this.getHash().replace(routeStripper, '');
            this.history.replaceState({}, document.title, this.root + this.fragment);
        }

        if ( ! this.options.silent)
        {
            return this.loadUrl();
        }
    },

    navigate : function(fragment, options) {
        var historyMethod, isSameFragment, url;
        if (fragment == null) {
            fragment = '';
        }
        if (!Backbone.History.started) {
            return false;
        }
        if (!options || options === true) {
            options = {
                trigger: options
            };
        }
        fragment = this.getFragment(fragment);
        url = this.root + fragment;
        if (this.fragment === fragment) {
            return false;
        }
        this.fragment = fragment;
        if (fragment.length === 0 && url !== '/') {
            url = url.slice(0, -1);
        }
        if (this._hasPushState) {
            historyMethod = options.replace ? 'replaceState' : 'pushState';
            this.history[historyMethod]({}, document.title, url);
        } else if (this._wantsHashChange) {
            this._updateHash(this.location, fragment, options.replace);
            isSameFragment = fragment !== this.getFragment(this.getHash(this.iframe));
            if ((this.iframe != null) && isSameFragment) {
                if (!options.replace) {
                    this.iframe.document.open().close();
                }
                this._updateHash(this.iframe.location, fragment, options.replace);
            }
        } else {
            return this.location.assign(url);
        }
        if (options.trigger) {
            return this.loadUrl(fragment);
        }
    }

});