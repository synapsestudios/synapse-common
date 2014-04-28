/** @jsx React.DOM */
/* global window */
'use strict';

var Backbone = require('backbone');

var isExternalLink = function(link)
{
    if (link.hasAttribute('target') && link.getAttribute('target') === '_blank')
    {
        return true;
    }

    if (link.hasAttribute('rel') && link.getAttribute('rel') === 'external')
    {
        return true;
    }

    if (link.protocol !== ':' && link.protocol !== 'http:' && link.protocol !== 'https:' && link.protocol !== 'file:')
    {
        return true;
    }

    if (link.hostname !== window.location.hostname && link.hostname !== '')
    {
        return true;
    }

    return false;
};

module.exports = {

    navigate : function(event)
    {
        var target   = event.currentTarget,
            isAnchor = target.nodeName === 'A',
            external = isExternalLink(target);

        if ( ! isAnchor)
            return;

        var href = target.getAttribute('href') || target.getAttribute('data-href') || null;

        if ( ! href || href === '' || href.charAt(0) === '#')
            return;

        if (isAnchor && external)
        {
            event.preventDefault();
            window.open(href);
            return;
        }

        Backbone.history.navigate(href, {trigger: true});

        event.preventDefault();
    },

    redirect : function(url)
    {
        Backbone.history.navigate(url, {trigger: true});
    }

};
