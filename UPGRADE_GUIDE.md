Upgrade Guide
=============

Pre-1.2.0 -> 1.2.0
------------------

### (Optional) Add login URI to config

The `auth-gateway` was improved in `1.1.0` so that if the user's access token is expired, it will automatically attempt to exchange the refresh token for a new access token. However, if the attempt to retrieve a new access token fails, (presumably because the refresh token is either invalid or expired,) the `auth-gateway` previously did nothing.

Starting in `1.2.0`, `auth-gateway` responds to this event by removing the old OAuth credentials from localStorage and sending the user to the **login page**. By default, it assumes the location of the login page is `/`. If the login page is at another URI, provide that location in the `login_url` property in your config:

```JavaScript
// config.js
module.exports = {
    api       : {/* ... */},
    login_url : '/login'
};
```

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

### Update clients which use `_getRequestOptions`, `_toQuery`, and `_buildParams`

In 0.3.0, the base gateway's `_getRequestOptions` method was renamed to `getRequestOptions`. Also `_toQuery` was renamed to `toQuery` and `_buildParams` was renamed to `buildParams`. For `client`s that use those methods, they should be renamed to follow suit.

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
