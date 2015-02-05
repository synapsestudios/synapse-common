Upgrade Guide
=============

Pre-0.3.0 -> 0.3.x
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

// 0.3.x
var UserClient = HttpGateway.extend({
    //...
    getRequestOptions : function(method, path)
    {
        var options = HttpGateway.prototype.getRequestOptions.call(this, method, path);

        // ...
    }
});
```
