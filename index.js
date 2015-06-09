var Gateway         = require('./http/gateway');
var AuthGateway     = require('./http/auth-gateway');
var ArrayObject     = require('./lib/array-object');
var Dispatcher      = require('./lib/dispatcher');
var MatchMediaStore = require('./store/match-media');
var DataProvider    = require('./test-helper/data-provider');
var FluxComponent   = require('./test-helper/flux-component');
var MockFlux        = require('./test-helper/mock-flux');

module.exports = {
    Gateway         : Gateway,
    AuthGateway     : AuthGateway,
    ArrayObject     : ArrayObject,
    Dispatcher      : Dispatcher,
    MatchMediaStore : MatchMediaStore,
    DataProvider    : DataProvider,
    FluxComponent   : FluxComponent,
    MockFlux        : MockFlux
};
