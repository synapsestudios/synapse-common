Upgrade Guide
=============

0.3.0 -> 1.0.0
------------------

### Stop using old-style stores and store-watch mixin

Early on, a custom implementation of flux used `auth`, `http`, and `base` stores as well as a `store-watch` mixin from this repo. These were soon replaced in project repos to use [Fluxxor](https://github.com/BinaryMuse/fluxxor). Those artifacts of the old, custom flux implementation have been removed in 1.0.0.

### Test helpers now exist in `/test-helper/`

This directory was moved from `/test-helpers/` to `/test-helper/` to match [Synapse Base](https://github.com/synapsestudios/synapse-base). Update any references to them to use the new directory.

```js
// 0.3.0
var MockFlux = require('synapse-common/test-helpers/mock-flux');
var using    = require('synapse-common/test-helpers/data-provider');

// 1.0.0
var MockFlux = require('synapse-common/test-helper/mock-flux');
var using    = require('synapse-common/test-helper/data-provider');
```

Pre-0.3.0 -> 0.3.0
------------------

### Update clients which override `_getRequestOptions`

In 0.3.0, the base gateway's `_getRequestOptions` method was renamed to `getRequestOptions`. For `client`s that override that method, it should be renamed to follow suit.

```js
// < 0.3.0
var UserClient = HttpGateway.extend({
    //...
    _getRequestOptions : function(method, path)
    {
        var options = HttpGateway.prototype._getRequestOptions.call(this, method, path);

        // ...
    }
});

// 0.3.0
var UserClient = HttpGateway.extend({
    //...
    getRequestOptions : function(method, path)
    {
        var options = HttpGateway.prototype.getRequestOptions.call(this, method, path);

        // ...
    }
});
```
