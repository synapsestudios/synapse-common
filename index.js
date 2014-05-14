'use strict';

exports.loaders = {
    jquery   : require('./loaders/jquery'),
    hammerjs : require('./loaders/hammerjs')
};

exports.lib = {
    EventBroker : require('./lib/event-broker'),
    History     : require('./lib/history'),
    mediator    : require('./lib/mediator'),
    Route       : require('./lib/route'),
    Router      : require('./lib/router'),
    SyncMachine : require('./lib/sync-machine'),
    routedLink : require('./ui/lib/routed-link')
};

exports.mixins = {
    events   : require('./ui/mixins/events'),
    navigate : require('./ui/mixins/navigate'),
    router   : require('./ui/mixins/router'),
    seo      : require('./ui/mixins/seo')
};